import { describe } from "vitest"
import { runMatrixTests } from "../utils/matrix-tests"
import { PRIMARY_COMBINATIONS } from "../utils/matrix.config"

// Shard 2: 93-186
describe("Matrix Shard 2/4", { timeout: 600_000 }, () => {
    runMatrixTests(PRIMARY_COMBINATIONS.slice(93, 186))
})
