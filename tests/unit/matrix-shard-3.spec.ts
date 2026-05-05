import { describe } from "vitest"
import { runMatrixTests } from "../utils/matrix-tests"
import { PRIMARY_COMBINATIONS } from "../utils/matrix.config"

// Shard 3: 186-279
describe("Matrix Shard 3/4", { timeout: 600_000 }, () => {
    runMatrixTests(PRIMARY_COMBINATIONS.slice(186, 279))
})
