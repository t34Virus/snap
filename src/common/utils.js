export function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export function generatePromptData(clientId, textForNode6, textForNode7) {
    return {
      number: Date.now(),
      client_id: clientId,
      "prompt": {
          "3": {
            "inputs": {
              "seed": 769945757570199,
              "steps": 10,
              "cfg": 2,
              "sampler_name": "dpmpp_sde",
              "scheduler": "karras",
              "denoise": 1,
              "model": [
                "32",
                0
              ],
              "positive": [
                "16",
                0
              ],
              "negative": [
                "16",
                1
              ],
              "latent_image": [
                "5",
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
              "ckpt_name": "realisticVisionV60B1_v60B1VAE.safetensors"
            },
            "class_type": "CheckpointLoaderSimple",
            "_meta": {
              "title": "Load Checkpoint"
            }
          },
          "5": {
            "inputs": {
              "width": 512,
              "height": 896,
              "batch_size": 1
            },
            "class_type": "EmptyLatentImage",
            "_meta": {
              "title": "Empty Latent Image"
            }
          },
          "7": {
            "inputs": {
              "text": "(((unknown-otherworldly-alien-like-anatomy, more-limbs-than-necessary, unknown-otherworldly-alien-like-anatomy-poses, unknown-otherwordly-alien-like-anatomy-gestures, unknown-otherworldly-alien-like-anatomy-distortions))), (((nsfw))), blurry, (naked), (nipples), (boobs), (breasts), (tits), (vagina), (pussy), (cunt), (ass), (butt), (anal), (tentacle), (cum), (hot), (slut), (nude), mutilated, extra fingers, mutated hands, poorly drawn hands, deformed, bad anatomy, bad proportions, disfigured, fused fingers, too many fingers, long neck, cross eyed, strabismus, wrinkles, jowels, old",
              "clip": [
                "17",
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
                "20",
                0
              ]
            },
            "class_type": "VAEDecode",
            "_meta": {
              "title": "VAE Decode"
            }
          },
          "11": {
            "inputs": {
              "ipadapter_file": "ip-adapter-plus-face_sd15.safetensors"
            },
            "class_type": "IPAdapterModelLoader",
            "_meta": {
              "title": "Load IPAdapter Model"
            }
          },
          "12": {
            "inputs": {
              "clip_name": "laion.safetensors"
            },
            "class_type": "CLIPVisionLoader",
            "_meta": {
              "title": "Load CLIP Vision"
            }
          },
          "13": {
            "inputs": {
              "image": "ABtransparent.png",
              "upload": "image"
            },
            "class_type": "LoadImage",
            "_meta": {
              "title": "Load Image"
            }
          },
          "15": {
            "inputs": {
              "control_net_name": "control_v11p_sd15_canny_fp16.safetensors"
            },
            "class_type": "ControlNetLoader",
            "_meta": {
              "title": "Load ControlNet Model"
            }
          },
          "16": {
            "inputs": {
              "strength": 0.7000000000000001,
              "start_percent": 0,
              "end_percent": 0.35000000000000003,
              "positive": [
                "74",
                0
              ],
              "negative": [
                "7",
                0
              ],
              "control_net": [
                "15",
                0
              ],
              "image": [
                "21",
                0
              ]
            },
            "class_type": "ControlNetApplyAdvanced",
            "_meta": {
              "title": "Apply ControlNet (Advanced)"
            }
          },
          "17": {
            "inputs": {
              "lora_name": "lcm\\SD1.5\\pytorch_lora_weights.safetensors",
              "strength_model": 1,
              "strength_clip": 1,
              "model": [
                "162",
                0
              ],
              "clip": [
                "4",
                1
              ]
            },
            "class_type": "LoraLoader",
            "_meta": {
              "title": "Load LoRA"
            }
          },
          "18": {
            "inputs": {
              "enabled": true,
              "swap_model": "inswapper_128.onnx",
              "facedetection": "retinaface_resnet50",
              "face_restore_model": "GFPGANv1.4.pth",
              "face_restore_visibility": 1,
              "codeformer_weight": 0.5,
              "detect_gender_source": "no",
              "detect_gender_input": "no",
              "source_faces_index": "0,1",
              "input_faces_index": "0,1",
              "console_log_level": 1,
              "input_image": [
                "8",
                0
              ],
              "source_image": [
                "151",
                0
              ]
            },
            "class_type": "ReActorFaceSwap",
            "_meta": {
              "title": "ReActor - Fast Face Swap"
            }
          },
          "20": {
            "inputs": {
              "vae_name": "vae-ft-mse-840000-ema-pruned.safetensors"
            },
            "class_type": "VAELoader",
            "_meta": {
              "title": "Load VAE"
            }
          },
          "21": {
            "inputs": {
              "low_threshold": 0.33,
              "high_threshold": 0.8,
              "image": [
                "151",
                0
              ]
            },
            "class_type": "Canny",
            "_meta": {
              "title": "Canny"
            }
          },
          "32": {
            "inputs": {
              "weight": 0.88,
              "noise": 1,
              "weight_type": "original",
              "start_at": 0,
              "end_at": 0.999,
              "unfold_batch": false,
              "ipadapter": [
                "11",
                0
              ],
              "clip_vision": [
                "12",
                0
              ],
              "image": [
                "151",
                0
              ],
              "model": [
                "17",
                0
              ]
            },
            "class_type": "IPAdapterApply",
            "_meta": {
              "title": "Apply IPAdapter"
            }
          },
          "74": {
            "inputs": {
              "text": "("+ textForNode7 +") (("+textForNode6+"))",
              "clip": [
                "17",
                1
              ]
            },
            "class_type": "CLIPTextEncode",
            "_meta": {
              "title": "CLIP Text Encode (Prompt)"
            }
          },
          "151": {
            "inputs": {
              "Input": 1,
              "image1": [
                "13",
                0
              ]
            },
            "class_type": "CR Image Input Switch",
            "_meta": {
              "title": "🔀 CR Image Input Switch"
            }
          },
          "155": {
            "inputs": {
              "sensitivity": 0.30000000000000004,
              "images": [
                "18",
                0
              ]
            },
            "class_type": "Safety Checker",
            "_meta": {
              "title": "Safety Checker"
            }
          },
          "162": {
            "inputs": {
              "unet_name": "diffusion_pytorch_model.safetensors"
            },
            "class_type": "UNETLoader",
            "_meta": {
              "title": "UNETLoader"
            }
          },
          "165": {
            "inputs": {
              "filename_prefix": "ComfyUI",
              "images": [
                "155",
                0
              ]
            },
            "class_type": "SaveImage",
            "_meta": {
              "title": "Save Image"
            }
          }
        }
      }
  }
  