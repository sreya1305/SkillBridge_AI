import assert from 'node:assert'
import { getSkillGapAnalysis } from '../frontend/src/lib/skillGap.js'

function runTest(name, fn) {
  try {
    fn()
    process.stdout.write(`✅ ${name}\n`)
  } catch (error) {
    process.stderr.write(`❌ ${name}\n${error.stack}\n`)
    process.exitCode = 1
  }
}

runTest('exact match counts matched skills', () => {
  const userSkills = ['JavaScript', 'React', 'Node.js']
  const roleSkills = {
    critical: ['JavaScript', 'React'],
    important: ['Node.js'],
    niceToHave: ['GraphQL'],
  }

  const result = getSkillGapAnalysis(userSkills, roleSkills)

  assert.deepStrictEqual(result.matchedSkills, ['JavaScript', 'React', 'Node.js'])
  assert.deepStrictEqual(result.missingSkills, {
    critical: [],
    important: [],
    niceToHave: ['GraphQL'],
  })
  assert.strictEqual(result.matchPercentage, 75.0)
  assert.strictEqual(result.totalRequiredSkills, 4)
  assert.strictEqual(result.matchedSkillCount, 3)
})

runTest('synonym match detects JS and ReactJS equivalence', () => {
  const userSkills = ['JS', 'ReactJS', 'Postgres']
  const roleSkills = {
    critical: ['JavaScript', 'React'],
    important: ['PostgreSQL'],
    niceToHave: ['CSS'],
  }

  const result = getSkillGapAnalysis(userSkills, roleSkills)

  assert.deepStrictEqual(result.matchedSkills, ['JavaScript', 'React', 'PostgreSQL'])
  assert.deepStrictEqual(result.missingSkills, {
    critical: [],
    important: [],
    niceToHave: ['CSS'],
  })
  assert.strictEqual(result.matchPercentage, 75.0)
  assert.strictEqual(result.totalRequiredSkills, 4)
  assert.strictEqual(result.matchedSkillCount, 3)
})

runTest('missing skills are categorized correctly', () => {
  const userSkills = ['JavaScript']
  const roleSkills = {
    critical: ['JavaScript', 'React'],
    important: ['SQL', 'Machine Learning'],
    niceToHave: ['Docker'],
  }

  const result = getSkillGapAnalysis(userSkills, roleSkills)

  assert.deepStrictEqual(result.missingSkills, {
    critical: ['React'],
    important: ['SQL', 'Machine Learning'],
    niceToHave: ['Docker'],
  })
  assert.strictEqual(result.matchPercentage, 20.0)
  assert.strictEqual(result.totalRequiredSkills, 5)
  assert.strictEqual(result.matchedSkillCount, 1)
})

runTest('empty input returns zeroed result', () => {
  const result = getSkillGapAnalysis([], {})

  assert.deepStrictEqual(result.matchedSkills, [])
  assert.deepStrictEqual(result.missingSkills, { critical: [], important: [], niceToHave: [] })
  assert.strictEqual(result.matchPercentage, 0)
  assert.strictEqual(result.totalRequiredSkills, 0)
  assert.strictEqual(result.matchedSkillCount, 0)
})
