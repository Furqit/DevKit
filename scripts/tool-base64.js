class Base64Tool {
  constructor() {
    // Tool elements
    this.container = document.getElementById('base64-tool');
    this.input = document.getElementById('base64-input');
    this.output = document.getElementById('base64-output');
    this.encodeButton = document.getElementById('encode-button');
    this.decodeButton = document.getElementById('decode-button');
    this.errorMessage = document.getElementById('base64-error');
    
    // Current mode (encode/decode)
    this.mode = 'encode';
    
    this.init();
  }
  
  init() {
    // Mode toggle handlers
    this.encodeButton.addEventListener('click', () => {
      this.setMode('encode');
      this.processInput();
    });
    
    this.decodeButton.addEventListener('click', () => {
      this.setMode('decode');
      this.processInput();
    });
    
    // Process button click handler
    const processButton = document.getElementById('process-base64');
    if (processButton) {
      processButton.addEventListener('click', () => this.processInput());
    }
    
    // Auto-process on paste (with small delay to ensure content is pasted)
    this.input.addEventListener('paste', () => {
      setTimeout(() => this.processInput(), 100);
    });
    
    // Clear error when input changes
    this.input.addEventListener('input', () => {
      this.errorMessage.classList.remove('visible');
    });
  }
  
  setMode(mode) {
    this.mode = mode;
    
    // Update UI to reflect current mode
    this.encodeButton.classList.toggle('active', mode === 'encode');
    this.decodeButton.classList.toggle('active', mode === 'decode');
    
    // Update button text if there's a process button
    const processButton = document.getElementById('process-base64');
    if (processButton) {
      processButton.textContent = mode === 'encode' ? 'Encode' : 'Decode';
    }
  }
  
  processInput() {
    const inputText = this.input.value;
    
    // Clear previous results
    this.errorMessage.classList.remove('visible');
    
    // Handle empty input
    if (!inputText) {
      this.output.value = '';
      return;
    }
    
    try {
      if (this.mode === 'encode') {
        // Encode text to Base64
        const encoded = btoa(inputText);
        this.output.value = encoded;
      } else {
        // Decode Base64 to text
        try {
          const decoded = atob(inputText);
          this.output.value = decoded;
        } catch (decodeError) {
          // Handle specific Base64 decoding errors
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