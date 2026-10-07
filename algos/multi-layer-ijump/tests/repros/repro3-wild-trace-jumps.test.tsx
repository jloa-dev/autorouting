import { getSimpleRouteJson } from "solver-utils"
import { test, expect } from "bun:test"
import { Circuit } from "@tscircuit/core"
import { MultilayerIjump } from "algos/multi-layer-ijump/MultilayerIjump"
import { getDebugSvg } from "algos/infinite-grid-ijump-astar/tests/fixtures/get-debug-svg"

test("repro3: wild trace jumps reproduction and debug snapshot", () => {
  const circuit = new Circuit()

  circuit.add(
    <board width="25mm" height="25mm" routingDisabled>
      <chip name="U1" pcbX={-5.51} pcbY={-12}>
        <footprint>
          <smtpad
            pcbX={0}
            pcbY={0}
            shape="rect"
            width="0.54mm"
            height="0.64mm"
            layer="top"
            portHints={["pin1"]}
          />
        </footprint>
      </chip>
      <chip name="U2" pcbX={1.75} pcbY={-17.55}>
        <footprint>
          <smtpad
            pcbX={0}
            pcbY={0}
            shape="rect"
            width="0.3mm"
            height="1.3mm"
            layer="top"
            portHints={["pin1"]}
          />
        </footprint>
      </chip>
      <chip name="Obstacle1" pcbX={-4.325} pcbY={-18.59}>
        <footprint>
          <platedhole
            pcbX={0}
            pcbY={0}
            holeDiameter="0.8mm"
            outerDiameter="1.2mm"
            portHints={["h1"]}
          />
        </footprint>
      </chip>
      <trace from=".U1 > .pin1" to=".U2 > .pin1" />
    </board>,
  )

  const inputCircuitJson = circuit.getCircuitJson()
  const input = getSimpleRouteJson(inputCircuitJson as any, { layerCount: 2 })

  const autorouter = new MultilayerIjump({
    input,
    debug: true,
  })

  const solution = autorouter.solveAndMapToTraces()

  expect(solution).toHaveLength(1)
  expect(
    getDebugSvg({ inputCircuitJson, autorouter, solution }),
  ).toMatchSvgSnapshot(import.meta.path)
})
