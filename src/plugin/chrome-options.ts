'use babel'

export const BinaryType = {
  Automatic: 'Auto',
  Custom: 'Custom'
}

export const ChromeOptions = {
  binaryPath: {
    type: 'string',
    title: 'Chrome Binary',
    default: BinaryType.Automatic,
    enum: [
      BinaryType.Automatic,
      BinaryType.Custom
    ]
  },
  customPath: {
    type: 'string',
    title: 'Custom Path',
    default: '',
    visible: {
      binaryPath: {
        contains: [ BinaryType.Custom ]
      }
    }
  },
  serverUrl: {
    type: 'string',
    title: 'Server Address',
    default: 'http://localhost:8080'
  }
}
