import { describe } from "vitest"
import { runMatrixTests } from "../utils/matrix-tests"
import { PRIMARY_COMBINATIONS } from "../utils/matrix.config"

// Shard 4: 279-375
describe("Matrix Shard 4/4", { timeout: 600_000 }, () => {
    runMatrixTests(PRIMARY_COMBINATIONS.slice(279))
})
