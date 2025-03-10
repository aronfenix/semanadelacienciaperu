// Componentes React
const e = React.createElement;

// Componente principal
const DensityVisualizer = () => {
  // Estados para controlar la aplicación
  const [waterDensity, setWaterDensity] = React.useState(1);
  const [saltAmount, setSaltAmount] = React.useState(0);
  const [showDensityValues, setShowDensityValues] = React.useState(true);
  const [showSurpriseMode, setShowSurpriseMode] = React.useState(false);
  const [selectedObject, setSelectedObject] = React.useState(null);
  
  // Objetos y sus densidades
  const objects = [
    { id: 1, name: 'Manzana', emoji: '🍎', density: 0.84, color: '#f56565', description: 'Contiene bolsas de aire que reducen su densidad total' },
    { id: 2, name: 'Zanahoria', emoji: '🥕', density: 1.04, color: '#ed8936', description: 'Alta en agua y fibra, lo que aumenta su densidad' },
    { id: 3, name: 'Plátano', emoji: '🍌', density: 0.94, color: '#ecc94b', description: 'Su estructura porosa contiene aire, haciéndolo menos denso que el agua' },
    { id: 4, name: 'Naranja con piel', emoji: '🍊', density: 0.85, color: '#f6ad55', description: 'La piel contiene aceites y bolsas de aire que la hacen flotar' },
    { id: 5, name: 'Naranja sin piel', emoji: '🟠', density: 1.02, color: '#dd6b20', description: 'Sin la piel, pierde las bolsas de aire y aumenta su densidad' },
    { id: 6, name: 'Patata', emoji: '🥔', density: 1.09, color: '#d69e2e', description: 'Alto contenido en almidón y agua la hace más densa que el agua' },
    { id: 7, name: 'Huevo', emoji: '🥚', density: 1.03, color: '#f7fafc', description: 'Ligeramente más denso que el agua dulce' },
    { id: 8, name: 'Coca-Cola normal', emoji: '🥤', density: 1.04, color: '#e53e3e', description: 'El azúcar aumenta su densidad' },
    { id: 9, name: 'Coca-Cola light', emoji: '🥤', density: 0.99, color: '#9ae6b4', description: 'Los edulcorantes son menos densos que el azúcar' },
  ];
  
  // Actualiza la densidad del agua basada en la cantidad de sal
  React.useEffect(() => {
    // Aproximadamente, cada 30g de sal por litro aumenta la densidad en 0.02 g/cm³
    const newDensity = 1 + (saltAmount * 0.02);
    setWaterDensity(newDensity);
  }, [saltAmount]);
  
  // Determina si un objeto flota basado en su densidad vs la densidad del agua
  const doesItFloat = (objectDensity) => {
    return objectDensity < waterDensity;
  };
  
  // Calcula la posición vertical de un objeto (para animación)
  const calculateObjectPosition = (objectDensity) => {
    const floats = doesItFloat(objectDensity);
    if (floats) {
      // Si flota, posicionarlo en la parte superior del agua
      return 30;
    } else {
      // Si se hunde, posicionarlo en el fondo
      return 70;
    }
  };
  
  // Renderiza los objetos en el contenedor
  const renderObjects = () => {
    return objects.map(obj => {
      const floats = doesItFloat(obj.density);
      const position = calculateObjectPosition(obj.density);
      const isSelected = selectedObject && selectedObject.id === obj.id;
      
      return e('div', {
        key: obj.id,
        className: `absolute transition-all duration-1000 ease-in-out cursor-pointer ${isSelected ? 'ring-4 ring-blue-500 z-10' : ''}`,
        style: { 
          left: `${10 + (obj.id - 1) * 10}%`, 
          top: `${position}%`,
          fontSize: '2rem',
          backgroundColor: obj.color,
          padding: '8px',
          borderRadius: '50%',
          transform: 'translateX(-50%)',
          opacity: isSelected ? 1 : 0.8
        },
        onClick: () => setSelectedObject(obj)
      }, e('span', { role: "img", "aria-label": obj.name }, obj.emoji));
    });
  };
  
  // Renderiza el modo sorpresa (naranja con/sin piel)
  const renderSurpriseMode = () => {
    const orangeWithPeel = objects.find(obj => obj.id === 4);
    const orangeWithoutPeel = objects.find(obj => obj.id === 5);
    
    const orangeWithPeelFloats = doesItFloat(orangeWithPeel.density);
    const orangeWithoutPeelFloats = doesItFloat(orangeWithoutPeel.density);
    
    const positionWithPeel = calculateObjectPosition(orangeWithPeel.density);
    const positionWithoutPeel = calculateObjectPosition(orangeWithoutPeel.density);
    
    return e('div', { className: "relative h-full w-full overflow-hidden rounded-xl" }, [
      // Agua
      e('div', { 
        className: "absolute bottom-0 w-full h-2/3 bg-blue-300 bg-opacity-70",
        key: "water" 
      }, 
        e('div', { 
          className: "absolute top-0 w-full h-4 bg-blue-200 bg-opacity-50 animate-pulse",
          key: "water-surface" 
        })
      ),
      
      // Objeto 1: Naranja con piel
      e('div', {
        className: "absolute transition-all duration-1000 ease-in-out left-1/3 cursor-pointer",
        style: { 
          top: `${positionWithPeel}%`,
          fontSize: '3rem',
          backgroundColor: orangeWithPeel.color,
          padding: '12px',
          borderRadius: '50%',
          transform: 'translateX(-50%)'
        },
        onClick: () => setSelectedObject(orangeWithPeel),
        key: "orange-with-peel"
      }, e('span', { role: "img", "aria-label": orangeWithPeel.name }, orangeWithPeel.emoji)),
      
      // Objeto 2: Naranja sin piel
      e('div', {
        className: "absolute transition-all duration-1000 ease-in-out left-2/3 cursor-pointer",
        style: { 
          top: `${positionWithoutPeel}%`,
          fontSize: '3rem',
          backgroundColor: orangeWithoutPeel.color,
          padding: '12px',
          borderRadius: '50%',
          transform: 'translateX(-50%)'
        },
        onClick: () => setSelectedObject(orangeWithoutPeel),
        key: "orange-without-peel"
      }, e('span', { role: "img", "aria-label": orangeWithoutPeel.name }, orangeWithoutPeel.emoji)),
      
      // Etiquetas
      e('div', {
        className: "absolute top-1/4 left-1/3 transform -translate-x-1/2 text-center",
        key: "label-with-peel"
      }, [
        e('div', { className: "bg-white px-2 py-1 rounded shadow text-sm", key: "label-text-1" }, "Naranja con piel"),
        e('div', { className: "mt-1 bg-blue-100 px-2 py-1 rounded shadow text-xs", key: "label-result-1" }, 
          orangeWithPeelFloats ? 'Flota' : 'Se hunde'
        )
      ]),
      
      e('div', {
        className: "absolute top-1/4 left-2/3 transform -translate-x-1/2 text-center",
        key: "label-without-peel"
      }, [
        e('div', { className: "bg-white px-2 py-1 rounded shadow text-sm", key: "label-text-2" }, "Naranja sin piel"),
        e('div', { className: "mt-1 bg-blue-100 px-2 py-1 rounded shadow text-xs", key: "label-result-2" }, 
          orangeWithoutPeelFloats ? 'Flota' : 'Se hunde'
        )
      ])
    ]);
  };
  
  return e('div', { className: "bg-gray-50 min-h-screen p-4" }, 
    e('div', { className: "max-w-4xl mx-auto" }, [
      // Encabezado
      e('div', { className: "text-center mb-6", key: "header" }, [
        e('h1', { className: "text-3xl font-bold text-blue-800" }, "Visualizador de Densidad y Flotabilidad"),
        e('p', { className: "text-gray-600" }, "Descubre por qué algunos objetos flotan y otros se hunden")
      ]),
      
      // Controles
      e('div', { className: "mb-6 p-4 bg-white rounded-lg shadow", key: "controls" }, [
        e('div', { className: "flex flex-col md:flex-row gap-4 items-center justify-between" }, [
          e('div', { className: "flex-1" }, [
            e('label', { className: "block text-sm font-medium text-gray-700 mb-1" }, "Cantidad de sal en el agua"),
            e('input', { 
              type: "range", 
              min: "0", 
              max: "5", 
              step: "0.5",
              value: saltAmount, 
              onChange: (ev) => setSaltAmount(parseFloat(ev.target.value)),
              className: "w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer"
            }),
            e('div', { className: "flex justify-between text-xs text-gray-500 mt-1" }, [
              e('span', {}, "Sin sal (1 g/cm³)"),
              e('span', {}, "Muy salada (1.1 g/cm³)")
            ])
          ]),
          
          e('div', { className: "flex gap-2" }, [
            e('button', { 
              onClick: () => setShowDensityValues(!showDensityValues),
              className: `px-3 py-1 rounded text-sm ${showDensityValues ? 'bg-blue-500 text-white' : 'bg-gray-200'}`
            }, showDensityValues ? 'Ocultar valores' : 'Mostrar valores'),
            
            e('button', { 
              onClick: () => setShowSurpriseMode(!showSurpriseMode),
              className: `px-3 py-1 rounded text-sm ${showSurpriseMode ? 'bg-purple-500 text-white' : 'bg-gray-200'}`
            }, showSurpriseMode ? 'Mostrar todos' : 'Modo sorpresa')
          ])
        ]),
        
        // Información sobre la densidad del agua
        e('div', { className: "mt-4 p-2 bg-blue-50 rounded text-sm" }, [
          e('p', { className: "font-medium" }, `Densidad actual del agua: ${waterDensity.toFixed(3)} g/cm³`),
          saltAmount > 0 && e('p', { className: "text-gray-600 text-xs" }, 
            `Has añadido aproximadamente ${(saltAmount * 30).toFixed(0)}g de sal por litro de agua`
          )
        ])
      ]),
      
      // Contenedor principal y visualización
      e('div', { className: "grid grid-cols-1 md:grid-cols-3 gap-6", key: "main-content" }, [
        // Visualización
        e('div', { 
          className: "md:col-span-2 bg-white rounded-xl shadow-lg overflow-hidden", 
          style: { height: '400px' },
          key: "visualization"
        }, 
          showSurpriseMode ? renderSurpriseMode() : 
          e('div', { className: "relative h-full w-full overflow-hidden" }, [
            // Agua
            e('div', { 
              className: "absolute bottom-0 w-full h-2/3 bg-blue-300 bg-opacity-70",
              key: "water" 
            }, 
              e('div', { 
                className: "absolute top-0 w-full h-4 bg-blue-200 bg-opacity-50 animate-pulse",
                key: "water-surface" 
              })
            ),
            
            // Línea de superficie del agua
            e('div', { className: "absolute top-1/3 w-full border-t-2 border-blue-400 border-dashed z-10", key: "water-line" }),
            
            // Etiqueta de la superficie del agua
            e('div', { 
              className: "absolute top-1/3 right-2 transform -translate-y-full bg-blue-100 px-2 py-1 rounded text-xs",
              key: "water-surface-label"
            }, "Superficie del agua"),
            
            // Renderizar objetos
            ...renderObjects()
          ])
        ),
        
        // Panel de información
        e('div', { className: "bg-white rounded-lg shadow-lg overflow-hidden", key: "info-panel" }, [
          e('div', { className: "p-4 bg-blue-800 text-white" }, 
            e('h2', { className: "text-lg font-bold" }, "Información")
          ),
          
          e('div', { className: "p-4" }, 
            selectedObject ? 
            e('div', {}, [
              e('div', { className: "flex items-center mb-4" }, [
                e('div', { 
                  className: "mr-3 p-2 rounded-full",
                  style: { backgroundColor: selectedObject.color, fontSize: '2rem' }
                }, e('span', { role: "img", "aria-label": selectedObject.name }, selectedObject.emoji)),
                e('div', {}, [
                  e('h3', { className: "text-lg font-bold" }, selectedObject.name),
                  e('p', { className: "text-sm text-gray-500" }, 
                    `Densidad: ${showDensityValues ? `${selectedObject.density} g/cm³` : '???'}`
                  )
                ])
              ]),
              
              e('div', { className: "mb-4" }, [
                e('div', { className: "flex justify-between items-center mb-1" }, [
                  e('span', { className: "text-sm font-medium" }, "Estado:"),
                  e('span', { 
                    className: `text-sm px-2 py-1 rounded ${doesItFloat(selectedObject.density) ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`
                  }, doesItFloat(selectedObject.density) ? 'Flota' : 'Se hunde')
                ]),
                
                e('p', { className: "text-sm mt-2" }, selectedObject.description)
              ]),
              
              e('div', { className: "p-3 bg-yellow-50 rounded-lg" }, 
                e('p', { className: "text-sm" }, [
                  e('strong', {}, "Recuerda:"),
                  " Un objeto flota cuando su densidad es menor que la del agua. ",
                  showDensityValues && e('span', {}, 
                    selectedObject.density < waterDensity ? 
                    ` ${selectedObject.density} g/cm³ es menor que ${waterDensity.toFixed(2)} g/cm³, por eso flota.` : 
                    ` ${selectedObject.density} g/cm³ es mayor que ${waterDensity.toFixed(2)} g/cm³, por eso se hunde.`
                  )
                ])
              )
            ]) : 
            e('div', { className: "text-center py-6" }, 
              e('p', { className: "text-gray-500" }, "Selecciona un objeto para ver su información")
            )
          ),
          
          // Leyenda
          e('div', { className: "p-4 border-t" }, [
            e('h3', { className: "font-medium mb-2" }, "¿Cómo funciona?"),
            e('ul', { className: "text-sm text-gray-700 space-y-1" }, [
              e('li', {}, "• Mueve el control deslizante para añadir sal al agua"),
              e('li', {}, "• La sal aumenta la densidad del agua"),
              e('li', {}, "• Observa cómo cambia qué objetos flotan o se hunden"),
              e('li', {}, "• Prueba el \"Modo sorpresa\" para ver la naranja con/sin piel")
            ])
          ])
        ])
      ]),
      
      // Explicación científica
      e('div', { className: "mt-6 p-4 bg-white rounded-lg shadow", key: "explanation" }, [
        e('h2', { className: "text-xl font-bold text-blue-800 mb-2" }, "La ciencia detrás de la flotabilidad"),
        e('p', { className: "mb-2" }, [
          "La flotabilidad es el resultado de la relación entre la ",
          e('strong', {}, "densidad"),
          " de un objeto y la densidad del líquido en el que se sumerge."
        ]),
        e('div', { className: "grid grid-cols-1 md:grid-cols-2 gap-4 mt-4" }, [
          e('div', { className: "p-3 bg-blue-50 rounded-lg" }, [
            e('h3', { className: "font-bold text-blue-800 mb-1" }, "¿Qué es la densidad?"),
            e('p', { className: "text-sm" }, 
              "La densidad es la relación entre la masa de un objeto y el volumen que ocupa. Se mide en gramos por centímetro cúbico (g/cm³)."
            )
          ]),
          e('div', { className: "p-3 bg-green-50 rounded-lg" }, [
            e('h3', { className: "font-bold text-green-800 mb-1" }, "¿Por qué flota un objeto?"),
            e('p', { className: "text-sm" }, 
              "Un objeto flota cuando su densidad es menor que la del líquido. El agua tiene una densidad de 1 g/cm³, por lo que cualquier objeto con densidad menor flotará."
            )
          ])
        ])
      ]),
      
      // Pie de página
      e('div', { className: "mt-8 text-center text-sm text-gray-500", key: "footer" }, [
        e('p', {}, "Visualizador interactivo creado para el experimento de flotabilidad"),
        e('p', {}, "5º de Primaria - Semana de la Ciencia")
      ])
    ])
  );
};

// Renderizar el componente en el DOM
const domContainer = document.getElementById('root');
ReactDOM.render(e(DensityVisualizer), domContainer);
