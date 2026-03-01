const fs = require('fs');
const assert = require('assert');

// Carregar o motor de recomendação
const RecommendationEngine = require('./recommendation-engine.js');

// Carregar dados de raquetes e cordas
const rackets = JSON.parse(fs.readFileSync('/home/ubuntu/upload/rackets.json', 'utf-8')).racketsData;
const strings = JSON.parse(fs.readFileSync('/home/ubuntu/upload/strings.json', 'utf-8')).stringsData;

// Instanciar o motor de recomendação
const engine = new RecommendationEngine(rackets, strings);

// Mock de respostas do usuário para teste
const mockAnswers = {
    level: { value: 'Intermediate' },
    ageRange: { value: '25-40' },
    physicality: { value: 'Athletic' },
    swingStyle: { value: 'Medium-Paced' },
    strokeType: { value: 'Mixed' },
    commonMiss: { value: 'None' },
    injuries: { value: 'None' },
    feelPreference: { value: 'Balanced' },
    feelWeights: {
        attributes: [
            { key: 'power', default: 7, min: 0, max: 10 },
            { key: 'control', default: 8, min: 0, max: 10 },
            { key: 'spin', default: 6, min: 0, max: 10 },
            { key: 'comfort', default: 5, min: 0, max: 10 },
        ]
    }
};

// Teste de recomendação de raquetes
const racquetRecommendations = engine.generateRacquetRecommendations(mockAnswers);
assert.strictEqual(racquetRecommendations.length, 5, 'Deve retornar 5 recomendações de raquetes');
assert(racquetRecommendations[0].score >= racquetRecommendations[1].score, 'As recomendações de raquetes devem estar em ordem decrescente de score');

console.log('Teste de recomendação de raquetes passou!');

// Teste de recomendação de cordas
const stringRecommendations = engine.generateStringRecommendations(mockAnswers);
assert.strictEqual(stringRecommendations.length, 5, 'Deve retornar 5 recomendações de cordas');
assert(stringRecommendations[0].score >= stringRecommendations[1].score, 'As recomendações de cordas devem estar em ordem decrescente de score');

console.log('Teste de recomendação de cordas passou!');
