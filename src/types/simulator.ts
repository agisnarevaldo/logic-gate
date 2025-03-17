export type ComponentType = "INPUT" | "OUTPUT" | "AND" | "OR" | "NOT" | "NAND" | "NOR" | "XOR" | "XNOR"

export interface Position {
    x: number;
    y: number;
}

export interface Port {
    id: string;
    name: string;
    value: boolean;
}

export interface Component {
    id: string;
    type: ComponentType;
    position: Position;
    inputs: Port[]
    outputs: Port[]
    width: number
    height: number
}

export interface ConnectionPoint {
    componentId: string;
    portId: string;
}

export interface Connection {
    id: string;
    from: ConnectionPoint;
    to: ConnectionPoint;
}

export interface SimulationResult {
    [componentId: string]: {
        inputs: boolean[]
        outputs: boolean[]
    }
}

export interface DraggingWire {
    fromComponent: string
    fromPort: string
    toPosition: Position | null
}