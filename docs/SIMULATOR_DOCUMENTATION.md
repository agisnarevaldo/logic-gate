# 📋 DOKUMENTASI TEKNIS - LOGIC GATE SIMULATOR

## 🎯 **Overview**
Logic Gate Simulator adalah fitur interaktif yang memungkinkan pengguna untuk membangun dan mensimulasikan rangkaian gerbang logika digital secara visual. Simulator menggunakan library ReactFlow untuk implementasi drag-and-drop interface dan visualisasi node-based.

---

## 🏗️ **Arsitektur Sistem**

### **1. Struktur File & Komponen**
```
src/
├── app/simulator/page.tsx                    # Halaman utama simulator
├── components/simulator/
│   ├── logic-gate-simulator.tsx             # Komponen utama simulator
│   ├── simulator-layout.tsx                 # Layout wrapper
│   ├── simulator-toolbar.tsx                # Toolbar komponen
│   ├── simulator-controls.tsx               # Kontrol simulasi
│   ├── nodes/
│   │   ├── input-node.tsx                   # Node input
│   │   ├── output-node.tsx                  # Node output
│   │   └── gate-node.tsx                    # Node gerbang logika
│   └── edges/
│       └── custom-edge.tsx                  # Kabel penghubung
├── types/simulator.ts                       # Type definitions
└── hooks/use-simulator.ts                   # Custom hook (tidak digunakan)
```

### **2. Technology Stack**
- **ReactFlow**: Library utama untuk node-based interface
- **React**: Framework UI
- **TypeScript**: Type safety
- **Tailwind CSS**: Styling
- **Lucide React**: Icons
- **UUID**: ID generation

---

## 🔧 **Komponen Utama**

### **1. LogicGateSimulator (Core Component)**
**File**: `src/components/simulator/logic-gate-simulator.tsx`

**Fungsi Utama**:
- Mengelola state nodes dan edges menggunakan ReactFlow hooks
- Menangani drag & drop komponen dari toolbar ke canvas
- Implementasi algoritma simulasi sirkuit digital
- Rendering canvas dengan ReactFlow

**State Management**:
```typescript
const [nodes, setNodes, onNodesChange] = useNodesState([])
const [edges, setEdges, onEdgesChange] = useEdgesState([])
const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null)
```

**Fungsi Kunci**:
- `onDrop()`: Menangani penambahan komponen baru ke canvas
- `onConnect()`: Membuat koneksi antar nodes
- `simulate()`: Algoritma simulasi sirkuit

### **2. SimulatorToolbar**
**File**: `src/components/simulator/simulator-toolbar.tsx`

**Fungsi**:
- Menyediakan komponen yang dapat di-drag ke canvas
- Mengimplementasikan HTML5 drag and drop API
- Grid layout responsif untuk mobile dan desktop

**Komponen Available**:
- INPUT, OUTPUT (I/O nodes)
- AND, OR, NOT (Basic gates)
- NAND, NOR, XOR, XNOR (Advanced gates)

### **3. Node Components**

#### **InputNode**
**File**: `src/components/simulator/nodes/input-node.tsx`
- Toggle button untuk mengubah nilai input (0/1)
- Satu output handle di sisi kanan
- Visual feedback dengan warna (hijau=1, abu=0)

#### **OutputNode**
**File**: `src/components/simulator/nodes/output-node.tsx`
- Menampilkan hasil output sebagai LED indicator
- Satu input handle di sisi kiri
- Visual feedback dengan warna

#### **GateNode**
**File**: `src/components/simulator/nodes/gate-node.tsx`
- Dua input handles di sisi kiri (atas dan bawah)
- Satu output handle di sisi kanan
- Label menampilkan tipe gerbang (AND, OR, dll)
- Menyimpan nilai input dalam array `inputValues`

### **4. CustomEdge**
**File**: `src/components/simulator/edges/custom-edge.tsx`
- Kabel penghubung dengan warna dinamis
- Hijau = sinyal HIGH (1), Abu = sinyal LOW (0)
- Menggunakan Bezier curves untuk path yang smooth

---

## ⚙️ **Algoritma Simulasi**

### **Proses Simulasi**
**File**: `src/components/simulator/logic-gate-simulator.tsx` (line 119-213)

**Langkah-langkah**:
1. **Propagasi Sinyal**: Nilai dari output nodes diteruskan ke input nodes melalui edges
2. **Kalkulasi Gerbang**: Setiap gate node menghitung output berdasarkan input dan tipe gerbang
3. **Iterasi**: Proses diulang hingga tidak ada perubahan nilai (steady state)
4. **Safety Limit**: Maksimal 100 iterasi untuk mencegah infinite loop

**Logic Implementation**:
```typescript
switch (gateType) {
    case "AND": outputValue = inputValues.every((v: boolean) => v); break
    case "OR": outputValue = inputValues.some((v: boolean) => v); break
    case "NOT": outputValue = !inputValues[0]; break
    case "NAND": outputValue = !inputValues.every((v: boolean) => v); break
    case "NOR": outputValue = !inputValues.some((v: boolean) => v); break
    case "XOR": outputValue = inputValues.filter((v: boolean) => v).length % 2 === 1; break
    case "XNOR": outputValue = inputValues.filter((v: boolean) => v).length % 2 === 0; break
}
```

---

## 🎮 **User Experience Flow**

### **1. Workflow Pengguna**
1. **Drag Components**: User drag komponen dari toolbar ke canvas
2. **Connect Nodes**: User menghubungkan output ke input dengan drag
3. **Set Input Values**: User klik toggle pada input nodes
4. **Run Simulation**: User klik tombol "Simulate"
5. **View Results**: Output nodes menampilkan hasil kalkulasi

### **2. Mobile Responsiveness**
- Grid 3 kolom untuk toolbar di mobile
- Touch-friendly controls
- Responsive canvas sizing
- Optimized button sizes untuk touch

---

## 📊 **Data Structure**

### **Node Data Structure**
```typescript
interface Node {
    id: string
    position: { x: number, y: number }
    type: "inputNode" | "outputNode" | "gateNode"
    data: {
        label?: string
        value: boolean
        gateType?: ComponentType
        inputValues?: boolean[]
    }
}
```

### **Edge Data Structure**
```typescript
interface Edge {
    id: string
    source: string
    target: string
    type: "custom"
    animated: boolean
    data: { value: boolean }
}
```

---

## 🚀 **Features**

### **Implemented Features**
✅ Drag & drop interface  
✅ Visual node-based circuit building  
✅ Real-time simulation  
✅ Interactive input toggles  
✅ Visual feedback (colors untuk signal states)  
✅ Mobile responsive design  
✅ All basic logic gates (AND, OR, NOT, NAND, NOR, XOR, XNOR)  

### **Missing/Incomplete Features**
❌ Save/Load circuit functionality  
❌ Export circuit as image  
❌ Clear canvas functionality  
❌ Undo/Redo operations  
❌ Multi-input gates (>2 inputs)  
❌ Truth table generation  
❌ Circuit validation  
❌ Performance optimization untuk large circuits  

---

## 🐛 **Known Issues & Limitations**

### **1. Simulation Algorithm Issues**
- **Performance**: Tidak optimal untuk sirkuit besar (O(n²) complexity)
- **Memory**: Potential memory leaks pada iterative simulation
- **Edge Cases**: Tidak handle circular dependencies dengan baik

### **2. UI/UX Issues**
- **Mobile Touch**: Drag & drop sulit di mobile devices
- **Visual Feedback**: Kurang indicator untuk connection states
- **Canvas Navigation**: Zoom dan pan controls terbatas

### **3. Data Persistence**
- **No Persistence**: Circuit hilang ketika page refresh
- **No Export**: Tidak bisa save sebagai file
- **No Templates**: Tidak ada preset circuits

### **4. Accessibility**
- **Keyboard Navigation**: Tidak support keyboard-only navigation
- **Screen Reader**: Tidak optimized untuk screen readers
- **Color Blindness**: Hanya menggunakan color untuk feedback

---

## 🎯 **Potential Improvements**

### **1. Performance Optimizations**
- Implement memoization untuk simulation results
- Lazy evaluation untuk unchanged parts
- Web Workers untuk heavy simulations
- Virtual scrolling untuk large circuits

### **2. Enhanced Features**
- Multi-select dan group operations
- Custom gate creation
- Subcircuit support
- Real-time collaboration
- Circuit sharing

### **3. Better Mobile Experience**
- Touch gestures untuk navigation
- Context menus untuk actions
- Better responsive layout
- Haptic feedback

### **4. Educational Features**
- Step-by-step simulation
- Truth table generator
- Timing diagrams
- Circuit analysis tools

---

## 📝 **Development Notes**

### **Code Quality**
- **TypeScript Usage**: Good type safety implementation
- **Component Structure**: Well-organized modular architecture
- **State Management**: Proper use of React hooks
- **Performance**: Some optimization opportunities available

### **Dependencies**
- **ReactFlow**: Core dependency, well maintained
- **UUID**: For unique ID generation
- **Lucide React**: Icon library, lightweight
- **Tailwind**: Utility-first CSS framework

---

## 📅 **Changelog**

### **Current Version**
- **Date**: July 3, 2025
- **Status**: Beta - Core functionality implemented
- **Last Analysis**: Complete technical documentation created

### **Next Steps**
- Await further instructions for specific improvements
- Ready for implementation of identified enhancements
- Prepared for bug fixes and feature additions

---

**Dokumentasi ini memberikan overview komprehensif tentang current state dari Logic Gate Simulator. Sistem sudah memiliki foundation yang solid untuk simulasi gerbang logika dasar, tetapi masih ada banyak ruang untuk improvement terutama dalam hal user experience, performance, dan features tambahan.**
