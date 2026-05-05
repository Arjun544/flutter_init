import { describe } from "vitest"
import { runMatrixTests } from "../utils/matrix-tests"
import { PRIMARY_COMBINATIONS } from "../utils/matrix.config"

// Shard 1: 0-93
describe("Matrix Shard 1/4", { timeout: 600_000 }, () => {
    runMatrixTests(PRIMARY_COMBINATIONS.slice(0, 93))
})
