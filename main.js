// Import CSS
import './styles/base.css';
import './styles/layout.css';
import './styles/theme.css';

// Import dependencies
import CodeMirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material-darker.css';
import 'codemirror/mode/javascript/javascript.js';
import 'codemirror/mode/yaml/yaml.js';
import 'codemirror/addon/edit/matchbrackets.js';
import 'codemirror/addon/edit/closebrackets.js';
import 'codemirror/addon/lint/lint.js';
import 'codemirror/addon/lint/lint.css';
import 'codemirror/addon/lint/json-lint.js';
import jsYaml from 'js-yaml';
import { jsonrepair } from 'jsonrepair';
import '@fortawesome/fontawesome-free/css/all.min.css';

// Make dependencies available globally
window.CodeMirror = CodeMirror;
window.jsyaml = jsYaml;
window.jsonrepair = jsonrepair;

// Import our scripts
import './scripts/sidebar.js';
import './scripts/tool-json.js';
import './scripts/tool-yaml.js';
import './scripts/tool-base64.js';
import './scripts/main.js'; 