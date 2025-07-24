import { v1 as uuidv1, v3 as uuidv3, v4 as uuidv4, v5 as uuidv5, validate, version } from 'uuid';

class UuidTool {
  constructor() {
    // Tool elements
    this.container = document.getElementById('uuid-tool');
    this.generateTab = document.getElementById('generate-tab');
    this.validateTab = document.getElementById('validate-tab');
    this.generateContent = document.getElementById('generate-content');
    this.validateContent = document.getElementById('validate-content');
    
    // Generate tab elements
    this.versionSelect = document.getElementById('uuid-version');
    this.namespaceOptions = document.getElementById('namespace-options');
    this.namespaceSelect = document.getElementById('uuid-namespace');
    this.customNamespaceContainer = document.getElementById('custom-namespace-container');
    this.customNamespaceInput = document.getElementById('custom-namespace');
    this.nameInputContainer = document.getElementById('name-input-container');
    this.nameInput = document.getElementById('uuid-name');
    this.countInput = document.getElementById('uuid-count');
    this.uppercaseCheckbox = document.getElementById('uppercase-uuid');
    this.generateButton = document.getElementById('generate-uuid');
    this.copyButton = document.getElementById('copy-uuid');
    this.downloadButton = document.getElementById('download-uuid');
    this.resultArea = document.getElementById('uuid-result');
    this.errorMessage = document.getElementById('uuid-error');
    this.successMessage = document.getElementById('uuid-success');
    
    // Validate tab elements
    this.validateInput = document.getElementById('uuid-validate-input');
    this.validateButton = document.getElementById('validate-uuid');
    this.validateError = document.getElementById('validate-error');
    this.validateResult = document.getElementById('validate-result');
    
    // Namespace UUIDs
    this.namespaces = {
      dns: '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
      url: '6ba7b811-9dad-11d1-80b4-00c04fd430c8',
      oid: '6ba7b812-9dad-11d1-80b4-00c04fd430c8',
      x500: '6ba7b814-9dad-11d1-80b4-00c04fd430c8',
      custom: ''
    };
    
    this.init();
  }
  
  init() {
    this.generateTab.addEventListener('click', () => this.switchTab('generate'));
    this.validateTab.addEventListener('click', () => this.switchTab('validate'));

    this.versionSelect.addEventListener('change', () => this.handleVersionChange());
    this.namespaceSelect.addEventListener('change', () => this.handleNamespaceChange());
    this.generateButton.addEventListener('click', () => this.generateUuid());
    this.copyButton.addEventListener('click', () => this.copyToClipboard());
    this.downloadButton.addEventListener('click', () => this.downloadUuid());
    this.validateButton.addEventListener('click', () => this.validateUuid());
    this.handleVersionChange();
  }
  
  switchTab(tab) {
    if (tab === 'generate') {
      this.generateTab.classList.add('active');
      this.validateTab.classList.remove('active');
      this.generateContent.classList.add('active');
      this.validateContent.classList.remove('active');
    } else {
      this.generateTab.classList.remove('active');
      this.validateTab.classList.add('active');
      this.generateContent.classList.remove('active');
      this.validateContent.classList.add('active');
    }
  }
  
  handleVersionChange() {
    const version = this.versionSelect.value;
    
    this.clearMessages();
    
    if (version === 'v3' || version === 'v5') {
      this.namespaceOptions.classList.remove('hidden');
      this.nameInputContainer.classList.remove('hidden');
      this.handleNamespaceChange();
    } else {
      this.namespaceOptions.classList.add('hidden');
      this.nameInputContainer.classList.add('hidden');
    }
  }
  
  handleNamespaceChange() {
    const namespaceType = this.namespaceSelect.value;
    
    if (namespaceType === 'custom') {
      this.customNamespaceContainer.classList.remove('hidden');
    } else {
      this.customNamespaceContainer.classList.add('hidden');
    }
  }
  
  generateUuid() {
    this.clearMessages();
    
    try {
      const version = this.versionSelect.value;
      const count = parseInt(this.countInput.value, 10);
      
      if (isNaN(count) || count < 1 || count > 100) {
        throw new Error('Number of UUIDs must be between 1 and 100');
      }
      
      let uuids = [];
      
      for (let i = 0; i < count; i++) {
        let uuid;
        
        switch (version) {
          case 'v1':
            uuid = uuidv1();
            break;
          case 'v3':
            uuid = this.generateNamespaceUuid(uuidv3);
            break;
          case 'v4':
            uuid = uuidv4();
            break;
          case 'v5':
            uuid = this.generateNamespaceUuid(uuidv5);
            break;
          default:
            throw new Error('Invalid UUID version');
        }
        
        if (this.uppercaseCheckbox.checked) {
          uuid = uuid.toUpperCase();
        }
        
        uuids.push(uuid);
      }
      
      this.resultArea.value = uuids.join('\n');
      this.showSuccess(`Generated ${count} UUID${count > 1 ? 's' : ''} successfully`);
      
    } catch (error) {
      this.showError(error.message);
    }
  }
  
  generateNamespaceUuid(uuidFunction) {
    const namespaceType = this.namespaceSelect.value;
    let namespaceUuid;
    
    if (namespaceType === 'custom') {
      namespaceUuid = this.customNamespaceInput.value.trim();
      
      if (!validate(namespaceUuid)) {
        throw new Error('Invalid custom namespace UUID');
      }
    } else {
      namespaceUuid = this.namespaces[namespaceType];
    }
    
    const name = this.nameInput.value.trim();
    if (!name) {
      throw new Error('Name is required for v3/v5 UUIDs');
    }
    
    return uuidFunction(name, namespaceUuid);
  }
  
  copyToClipboard() {
    const text = this.resultArea.value;
    
    if (!text) {
      this.showError('No UUID to copy');
      return;
    }
    
    navigator.clipboard.writeText(text)
      .then(() => {
        this.showSuccess('Copied to clipboard');
      })
      .catch(err => {
        this.showError('Failed to copy to clipboard');
      });
  }
  
  downloadUuid() {
    const text = this.resultArea.value;
    
    if (!text) {
      this.showError('No UUID to download');
      return;
    }
    
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    
    a.href = url;
    a.download = 'uuids.txt';
    document.body.appendChild(a);
    a.click();
    
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 0);
    
    this.showSuccess('Downloaded UUIDs');
  }
  
  validateUuid() {
    this.validateError.classList.remove('visible');
    this.validateResult.classList.remove('visible');
    
    const uuid = this.validateInput.value.trim();
    
    if (!uuid) {
      this.showValidateError('Please enter a UUID to validate');
      return;
    }
    
    if (validate(uuid)) {
      const uuidVersion = version(uuid);
      this.showValidateResult(`Valid UUID (version ${uuidVersion})`);
    } else {
      this.showValidateError('Invalid UUID format');
    }
  }
  
  clearMessages() {
    this.errorMessage.classList.remove('visible');
    this.successMessage.classList.remove('visible');
  }
  
  showError(message) {
    this.errorMessage.textContent = message;
    this.errorMessage.classList.add('visible');
  }
  
  showSuccess(message) {
    this.successMessage.textContent = message;
    this.successMessage.classList.add('visible');
  }
  
  showValidateError(message) {
    this.validateError.textContent = message;
    this.validateError.classList.add('visible');
  }
  
  showValidateResult(message) {
    this.validateResult.textContent = message;
    this.validateResult.classList.add('visible');
  }
}

export default UuidTool; 