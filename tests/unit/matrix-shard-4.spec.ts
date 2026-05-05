import { describe } from "vitest"
import { PRIMARY_COMBINATIONS } from "../utils/matrix.config"
import { runMatrixTests } from "../utils/matrix-tests"

// Shard 4: 279-375
describe("Matrix Shard 4/4", { timeout: 600_000 }, () => {
    runMatrixTests(PRIMARY_COMBINATIONS.slice(279))
})
