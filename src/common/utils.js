import api from "../common/api.json"

export function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function replaceWithPrompts(prompt1, prompt2) {
  Object.keys(api).forEach(key => {
    if (api[key].inputs.text === "(news anchor)") {
      api[key].inputs.text = `(${prompt2})`;
    }

    if (api[key].class_type === "Enhancer") {
      api[key].inputs.prompt = prompt1;
    }
  });
  return api;
}

export function generatePromptData(clientId, textForNode6, textForNode7) {

  let updatedApi = replaceWithPrompts(textForNode6, textForNode7);
    return {
      client_id: clientId,
      "prompt": updatedApi
    }
}
  