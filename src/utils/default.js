export function status() {
  const status =
    [{
      value: '1',
      label: 'Activado'
    }, {
      value: '2',
      label: 'Por Confirmar'
    }, {
      value: '3',
      label: 'Desactivado'
    }]

  return status;
}
export function tipoevent() {
  const status =
    [{
      value: '1',
      label: 'Publico'
    }, {
      value: '2',
      label: 'Privado'
    }, {
      value: '3',
      label: 'Cerrado'
    }]

  return status;
}
export function tipoaudiencia() {
  const status =
    [{
      value: '1',
      label: 'Apto para todos'
    }, {
      value: '2',
      label: 'Mayor de Edad'
    }, {
      value: '3',
      label: 'Solo niños'
    }]

  return status;
}