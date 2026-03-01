class RecommendationEngine {
    constructor(rackets, strings) {
        this.rackets = rackets;
        this.strings = strings;
        this.racquetAttributeKeys = ["power", "control", "spin", "maneuverability", "feel", "stability", "comfort", "forgiveness"];
        this.stringAttributeKeys = ["power", "control", "spin", "comfort", "durability", "feel", "tension_stability"];
    }

    _normalize(value, min, max) {
        if (max === min) return 1;
        return (value - min) / (max - min);
    }

    _buildPlayerProfile(answers) {
        const profile = {
            weights: {},
            preferences: {}
        };

        this.racquetAttributeKeys.forEach(key => profile.weights[key] = 0.01);

        const feelWeights = answers["feelWeights"]?.attributes || [];
        feelWeights.forEach(attr => {
            const key = attr.key.toLowerCase();
            if(this.racquetAttributeKeys.includes(key)) {
                profile.weights[key] = this._normalize(attr.default, attr.min, attr.max);
            }
        });

        let totalWeight = Object.values(profile.weights).reduce((sum, weight) => sum + weight, 0);
        if (totalWeight > 0) {
            for (const key in profile.weights) {
                profile.weights[key] /= totalWeight;
            }
        }

        const adjustments = {
            level: answers["level"]?.value,
            ageRange: answers["ageRange"]?.value,
            physicality: answers["physicality"]?.value,
            swingStyle: answers["swingStyle"]?.value,
            strokeType: answers["strokeType"]?.value,
            commonMiss: answers["commonMiss"]?.value,
            injuries: answers["injuries"]?.value,
            backhand: answers["backhand"]?.value
        };

        if (adjustments.injuries && adjustments.injuries !== "None") {
            profile.weights.comfort = Math.min(1, (profile.weights.comfort || 0.1) * 1.5 + 0.2);
        }
        if (adjustments.ageRange === "Senior (55+)") {
            profile.weights.comfort = Math.min(1, (profile.weights.comfort || 0.1) * 1.3 + 0.1);
            profile.weights.power = Math.min(1, (profile.weights.power || 0.1) * 1.2);
            profile.weights.maneuverability = Math.min(1, (profile.weights.maneuverability || 0.1) * 1.2);
        }
        if (adjustments.commonMiss === "Long") {
            profile.weights.control = Math.min(1, (profile.weights.control || 0.1) * 1.4 + 0.15);
        }
        if (adjustments.commonMiss === "Net") {
            profile.weights.power = Math.min(1, (profile.weights.power || 0.1) * 1.4 + 0.15);
        }
        if (adjustments.strokeType === "Mostly Topspin") {
            profile.weights.spin = Math.min(1, (profile.weights.spin || 0.1) * 1.3 + 0.1);
        }

        totalWeight = Object.values(profile.weights).reduce((sum, weight) => sum + weight, 0);
        if (totalWeight > 0) {
            for (const key in profile.weights) {
                profile.weights[key] /= totalWeight;
            }
        }

        profile.preferences = adjustments;
        return profile;
    }

    _createIdealRacquetVector(profile) {
        const idealVector = {};
        this.racquetAttributeKeys.forEach(key => idealVector[key] = 0.5);

        if (profile.preferences.swingStyle === "Short/Compact" || profile.preferences.commonMiss === "Net") {
            idealVector.power = 0.8;
        } else if (profile.preferences.swingStyle === "Fast/Full") {
            idealVector.power = 0.3;
        }

        if (profile.preferences.swingStyle === "Fast/Full" || profile.preferences.commonMiss === "Long") {
            idealVector.control = 0.9;
        } else {
            idealVector.control = 0.6;
        }

        if (profile.preferences.injuries !== "None" || profile.preferences.ageRange === "Senior (55+)") {
            idealVector.comfort = 0.9;
        }

        if (profile.preferences.level === "Beginner") {
            idealVector.forgiveness = 0.8;
        }

        if (profile.preferences.physicality === "Strong" || profile.preferences.level === "Advanced") {
            idealVector.stability = 0.8;
        }

        if (profile.preferences.physicality === "Light" || profile.preferences.backhand === "One-Handed") {
            idealVector.maneuverability = 0.8;
        }

        return idealVector;
    }

    _calculateRacquetScore(racket, idealVector, weights, preferences) {
        let weightedDistance = 0;

        this.racquetAttributeKeys.forEach(key => {
            const racketValue = racket[key] || 0.5;
            const idealValue = idealVector[key];
            const weight = weights[key] || 0.1;
            weightedDistance += weight * Math.pow(racketValue - idealValue, 2);
        });

        const distance = Math.sqrt(weightedDistance);
        let score = Math.max(0, 100 * (1 - distance));

        if (racket.playerLevel.includes(preferences.level)) {
            score += 5;
        } else {
            score -= 5;
        }

        if (preferences.injuries !== "None" && racket.stiffness > 68) {
            score -= 15;
        }

        return Math.max(0, Math.min(100, score));
    }

    generateRacquetRecommendations(answers) {
        const profile = this._buildPlayerProfile(answers);
        const idealVector = this._createIdealRacquetVector(profile);

        const scoredRackets = this.rackets
            .filter(racket => {
                if (profile.preferences.level === "Beginner" && racket.playerLevel.includes("Advanced")) {
                    return false;
                }
                if (profile.preferences.level === "Advanced" && racket.playerLevel.includes("Beginner")) {
                    return false;
                }
                return true;
            })
            .map(racket => {
                const score = this._calculateRacquetScore(racket, idealVector, profile.weights, profile.preferences);
                return { ...racket, score };
            });

        const sortedRackets = scoredRackets.sort((a, b) => b.score - a.score);

        return sortedRackets.slice(0, 5).map((racket, index, arr) => {
            const diff_to_next_pct = (index < arr.length - 1) ? (racket.score - arr[index + 1].score) : 0;
            return {
                ...racket,
                rank: index + 1,
                score: Math.round(racket.score),
                diff_to_next_pct: Math.round(diff_to_next_pct * 100) / 100,
                attribute_match: this._getRacquetAttributeMatchDetails(racket, idealVector)
            };
        });
    }

    _getRacquetAttributeMatchDetails(racket, idealVector) {
        const details = {};
        this.racquetAttributeKeys.forEach(key => {
            const racketValue = racket[key] || 0.5;
            const idealValue = idealVector[key];
            details[key] = {
                racket: racketValue,
                ideal: idealValue,
                match_percentage: 100 * (1 - Math.abs(racketValue - idealValue))
            };
        });
        return details;
    }

    _buildStringProfile(answers) {
        const profile = {
            weights: {},
            preferences: {}
        };
        
        this.stringAttributeKeys.forEach(key => profile.weights[key] = 0.01);

        const feelPreference = answers["stringFeel"]?.value;
        if (feelPreference === "Soft") {
            profile.weights.comfort = 0.8;
            profile.weights.power = 0.6;
        } else if (feelPreference === "Crisp") {
            profile.weights.control = 0.8;
            profile.weights.feel = 0.7;
        }

        const adjustments = {
            level: answers["level"]?.value,
            swingStyle: answers["swingStyle"]?.value,
            breakStrings: answers["breakStrings"]?.value,
            armIssues: answers["armIssues"]?.value,
            budget: answers["budget"]?.value
        };

        if (adjustments.armIssues !== "No, I have no arm issues") {
            profile.weights.comfort = Math.min(1, (profile.weights.comfort || 0.1) * 1.6 + 0.3);
        }

        if (adjustments.breakStrings === "Yes, frequently") {
            profile.weights.durability = Math.min(1, (profile.weights.durability || 0.1) * 1.5 + 0.2);
        }
        
        let totalWeight = Object.values(profile.weights).reduce((sum, weight) => sum + weight, 0);
        if (totalWeight > 0) {
            for (const key in profile.weights) {
                profile.weights[key] /= totalWeight;
            }
        }

        profile.preferences = adjustments;
        return profile;
    }

    _createIdealStringVector(profile) {
        const idealVector = {};
        this.stringAttributeKeys.forEach(key => idealVector[key] = 0.5);

        if (profile.preferences.swingStyle === "Fast/Full") {
            idealVector.control = 0.8;
            idealVector.power = 0.3;
        } else {
            idealVector.power = 0.7;
            idealVector.control = 0.4;
        }

        if (profile.preferences.armIssues !== "No, I have no arm issues") {
            idealVector.comfort = 0.9;
        }
        
        if (profile.preferences.breakStrings === "Yes, frequently") {
            idealVector.durability = 0.9;
        }

        return idealVector;
    }

    _calculateStringScore(string, idealVector, weights, preferences) {
        let weightedDistance = 0;

        this.stringAttributeKeys.forEach(key => {
            const stringValue = string[key] || 0.5;
            const idealValue = idealVector[key];
            const weight = weights[key] || 0.1;
            weightedDistance += weight * Math.pow(stringValue - idealValue, 2);
        });

        const distance = Math.sqrt(weightedDistance);
        let score = Math.max(0, 100 * (1 - distance));

        if (string.player_level && string.player_level.includes(preferences.level)) {
            score += 5;
        }

        if (preferences.armIssues !== "No, I have no arm issues" && string.material === "Polyester") {
            score -= 25;
        }

        const budgetMap = {
            "Up to $15": 15,
            "$15 - $25": 25,
            "$25+": Infinity
        };
        const price = string.price;

        if (preferences.budget && price > budgetMap[preferences.budget]) {
            score -= 15;
        }

        return Math.max(0, Math.min(100, score));
    }

    generateStringRecommendations(answers) {
        const profile = this._buildStringProfile(answers);
        const idealVector = this._createIdealStringVector(profile);

        const scoredStrings = this.strings.map(string => {
            const score = this._calculateStringScore(string, idealVector, profile.weights, profile.preferences);
            return { ...string, score };
        });

        const sortedStrings = scoredStrings.sort((a, b) => b.score - a.score);

        return sortedStrings.slice(0, 5).map((string, index, arr) => {
            const diff_to_next_pct = (index < arr.length - 1) ? (string.score - arr[index + 1].score) : 0;
            return {
                ...string,
                rank: index + 1,
                score: Math.round(string.score),
                diff_to_next_pct: Math.round(diff_to_next_pct * 100) / 100,
                attribute_match: this._getStringAttributeMatchDetails(string, idealVector)
            };
        });
    }

    _getStringAttributeMatchDetails(string, idealVector) {
        const details = {};
        this.stringAttributeKeys.forEach(key => {
            const stringValue = string[key] || 0.5;
            const idealValue = idealVector[key];
            details[key] = {
                string: stringValue,
                ideal: idealValue,
                match_percentage: 100 * (1 - Math.abs(stringValue - idealValue))
            };
        });
        return details;
    }
}

module.exports = RecommendationEngine;
