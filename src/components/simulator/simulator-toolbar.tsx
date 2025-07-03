"use client"

import type React from "react"
import { useState } from "react"
import type { ComponentType } from "@/types/simulator"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { 
  AndGateSymbol, 
  OrGateSymbol, 
  NotGateSymbol, 
  NandGateSymbol, 
  NorGateSymbol, 
  XorGateSymbol, 
  XnorGateSymbol,
  InputSwitchSymbol,
  OutputLampSymbol
} from "@/components/quiz/logic-gate-symbols"

interface SimulatorToolbarProps {
  onComponentSelect?: (componentType: ComponentType) => void
  selectedComponent?: ComponentType | null
  isOpen: boolean
  onToggle: () => void
}

export function SimulatorToolbar({ onComponentSelect, selectedComponent, isOpen, onToggle }: SimulatorToolbarProps) {
    const [activeComponent, setActiveComponent] = useState<ComponentType | null>(null)

    const onDragStart = (event: React.DragEvent<HTMLDivElement>, nodeType: ComponentType) => {
        event.dataTransfer.setData("application/reactflow", nodeType)
        event.dataTransfer.effectAllowed = "move"
    }

    const handleComponentClick = (componentType: ComponentType) => {
        setActiveComponent(componentType)
        onComponentSelect?.(componentType)
        // Auto close sidebar on mobile after selection
        if (window.innerWidth < 768) {
            onToggle()
        }
    }

    const components: { type: ComponentType; icon: React.ReactNode; label: string }[] = [
        { 
          type: "INPUT", 
          icon: <InputSwitchSymbol className="w-full h-full" isOn={false} />, 
          label: "Input" 
        },
        { 
          type: "OUTPUT", 
          icon: <OutputLampSymbol className="w-full h-full" isOn={false} />, 
          label: "Output" 
        },
        { 
          type: "AND", 
          icon: <AndGateSymbol className="w-full h-full" />, 
          label: "AND" 
        },
        { 
          type: "OR", 
          icon: <OrGateSymbol className="w-full h-full" />, 
          label: "OR" 
        },
        { 
          type: "NOT", 
          icon: <NotGateSymbol className="w-full h-full" />, 
          label: "NOT" 
        },
        { 
          type: "NAND", 
          icon: <NandGateSymbol className="w-full h-full" />, 
          label: "NAND" 
        },
        { 
          type: "NOR", 
          icon: <NorGateSymbol className="w-full h-full" />, 
          label: "NOR" 
        },
        { 
          type: "XOR", 
          icon: <XorGateSymbol className="w-full h-full" />, 
          label: "XOR" 
        },
        { 
          type: "XNOR", 
          icon: <XnorGateSymbol className="w-full h-full" />, 
          label: "XNOR" 
        },
    ]

    return (
        <div className={`
            fixed top-0 left-0 h-full bg-white shadow-lg z-50 transition-transform duration-300 ease-in-out
            ${isOpen ? 'translate-x-0' : '-translate-x-full'}
            w-72 md:w-80 overflow-y-auto
        `}>
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b bg-gray-50">
                <h3 className="text-lg font-semibold">Komponen Logic Gate</h3>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onToggle}
                    className="p-2"
                >
                    <X className="w-5 h-5" />
                </Button>
            </div>

            {/* Content */}
            <div className="p-4">
                <p className="text-sm text-gray-600 mb-4">
                    Klik komponen lalu klik canvas
                </p>
                
                <div className="flex flex-col gap-3">
                    {components.map((component) => (
                        <div
                            key={component.type}
                            draggable
                            onDragStart={(event) => onDragStart(event, component.type)}
                            onClick={() => handleComponentClick(component.type)}
                            className="cursor-grab touch-manipulation"
                        >
                            <Button
                                variant="outline"
                                className={`flex items-center justify-center w-full p-2 gap-2 transition-all ${
                                  (activeComponent === component.type || selectedComponent === component.type)
                                    ? "bg-blue-100 border-blue-500 border-2"
                                    : "bg-white hover:bg-gray-50"
                                }`}
                            >
                                
                                <span className="font-medium">{component.label}</span>
                                <div className="">
                                  {component.icon}
                                </div>
                            </Button>
                        </div>
                    ))}
                </div>
                
                {activeComponent && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm text-blue-800">
                    <strong>{activeComponent}</strong> dipilih. Klik pada canvas untuk menempatkannya.
                  </div>
                )}
            </div>
        </div>
    )
}
