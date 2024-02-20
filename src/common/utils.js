export function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
  
// Add to utils.js

export function generatePromptData(clientId, textForNode6, textForNode7) {
    return {
      number: Date.now(),
      client_id: clientId,
      "prompt": {
        "3": {
          "inputs": {
            "seed": 712659071398148,
            "steps": 20,
            "cfg": 8,
            "sampler_name": "euler",
            "scheduler": "normal",
            "denoise": 1,
            "model": [
              "4",
              0
            ],
            "positive": [
              "6",
              0
            ],
            "negative": [
              "7",
              0
            ],
            "latent_image": [
              "11",
              0
            ]
          },
          "class_type": "KSampler",
          "_meta": {
            "title": "KSampler"
          }
        },
        "4": {
          "inputs": {
            "ckpt_name": "v1-5-pruned-emaonly.ckpt"
          },
          "class_type": "CheckpointLoaderSimple",
          "_meta": {
            "title": "Load Checkpoint"
          }
        },
        "6": {
          "inputs": {
            "text": textForNode6,
            "clip": [
              "4",
              1
            ]
          },
          "class_type": "CLIPTextEncode",
          "_meta": {
            "title": "CLIP Text Encode (Prompt)"
          }
        },
        "7": {
          "inputs": {
            "text": textForNode7,
            "clip": [
              "4",
              1
            ]
          },
          "class_type": "CLIPTextEncode",
          "_meta": {
            "title": "CLIP Text Encode (Prompt)"
          }
        },
        "8": {
          "inputs": {
            "samples": [
              "3",
              0
            ],
            "vae": [
              "4",
              2
            ]
          },
          "class_type": "VAEDecode",
          "_meta": {
            "title": "VAE Decode"
          }
        },
        "9": {
          "inputs": {
            "filename_prefix": "ComfyUI",
            "images": [
              "8",
              0
            ]
          },
          "class_type": "SaveImage",
          "_meta": {
            "title": "Save Image"
          }
        },
        "10": {
          "inputs": {
            "image": "example1.jpg",
            "upload": "image"
          },
          "class_type": "LoadImage",
          "_meta": {
            "title": "Load Image"
          }
        },
        "11": {
          "inputs": {
            "pixels": [
              "10",
              0
            ],
            "vae": [
              "4",
              2
            ]
          },
          "class_type": "VAEEncode",
          "_meta": {
            "title": "VAE Encode"
          }
        }
      }
    };
  }
  