class Base64Tool {
  constructor() {
    // Tool elements
    this.container = document.getElementById('base64-tool');
    this.input = document.getElementById('base64-input');
    this.output = document.getElementById('base64-output');
    this.encodeButton = document.getElementById('encode-button');
    this.decodeButton = document.getElementById('decode-button');
    this.errorMessage = document.getElementById('base64-error');
    
    this.mode = 'encode';
    
    this.init();
  }
  
  init() {
    this.encodeButton.addEventListener('click', () => {
      this.setMode('encode');
      this.processInput();
    });
    
    this.decodeButton.addEventListener('click', () => {
      this.setMode('decode');
      this.processInput();
    });
    
    const processButton = document.getElementById('process-base64');
    if (processButton) {
      processButton.addEventListener('click', () => this.processInput());
    }
    
    this.input.addEventListener('paste', () => {
      setTimeout(() => this.processInput(), 100);
    });
    
    this.input.addEventListener('input', () => {
      this.errorMessage.classList.remove('visible');
    });
  }
  
  setMode(mode) {
    this.mode = mode;
    
    this.encodeButton.classList.toggle('active', mode === 'encode');
    this.decodeButton.classList.toggle('active', mode === 'decode');
    
    const processButton = document.getElementById('process-base64');
    if (processButton) {
      processButton.textContent = mode === 'encode' ? 'Encode' : 'Decode';
    }
  }
  
  processInput() {
    const inputText = this.input.value;
    
    this.errorMessage.classList.remove('visible');
    
    if (!inputText) {
      this.output.value = '';
      return;
    }
    
    try {
      if (this.mode === 'encode') {
        const encoded = btoa(inputText);
        this.output.value = encoded;
      } else {
        try {
          const decoded = atob(inputText);
          this.output.value = decoded;
        } catch (decodeError) {
          if (decodeError.message.includes('not correctly encoded')) {
            throw new Error('Invalid Base64 string. Please check your input and ensure it contains only valid Base64 characters.');
          } else {
            throw decodeError;
          }
        }
      }
    } catch (error) {
      this.showError(error.message);
    }
  }
  
  showError(message) {
    this.errorMessage.textContent = message;
    this.errorMessage.classList.add('visible');
  }
}

export default Base64Tool;