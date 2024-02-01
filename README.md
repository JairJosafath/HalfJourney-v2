# HalfJourney v2 (re:invented)

HalfJourney is a generative ai enabled bot on discord, powered by AWS. \
HalfJourney v1 solution is still on this repository: [www.github.com/JairJosafath/HalfJourney-v1.com](https://github.com/JairJosafath/HalfJourney-v1)
\
## Why v2?
After re:invent 2023, I decided to upgrade the solution based on the new services and functionalities \
bedrock has to offer. Using step-functions it is easier to manage the flow of data.


## model access struggle
I wasnot able to get access to models in the same region. That's why you will notice that there's 2 different sam templates. Stacks are regional, so it's not possible to create a multi-regional sam template. These are the 2 models I had access to:
- Amazon: Titan Text G1 - Express in Frankfurt (eu-central-1)
- Stability AI: SDXL 0.8 in Oregon (us-west-2)

both stacks can be centrally managed via package.json scripts. \
**if you have access to the models in the same region, you don't need to configure the scripts and other workarounds.**

## Request handler
is the stack that handles the requests from the discord bot. It's a lambda function that is triggered by an API Gateway and starts a stepfunction execution. \
scripts:
- `npm run build/validate/deploy:rh` you can change the scripts in package.json based on the regions you want to deploy to. 

## Image generator
is the stack that handles the image generation. It's a state machine that is triggered by the invoke api action in the request handler. 
scripts:
- `npm run build/validate/deploy:ig` you can change the scripts in package.json based on the regions you want to deploy to. 

## lambda function
The lambda function is written in Typescript. It is managed via the cli, so you need to build it after you make changes. Adjust the build script in package.json to your needs. The build specification is in /request-handler/functions/build.mjs
scripts:
- `npm run build:lambda`

## connect to discord
The discord bot needs an endpoint url, which is the api gateway url in the request handler stack.

## configuration files (optional)
The config files are stored via parameter store in AWS. You should create these parameters before you deploy the stacks (use dummy values if you don't have the right ones yet). You could also just hardcode all of the values in your template without using a parameter store(not recommended). The parameters are:\
**In the request handler stack:**
- HalfJourney/TitanModelArn
- HalfJourney/API-ig-Endpoint (this is the api gateway url, you won't have this until you deploy the image generator stack)
- PUBLIC_KEY (this is the public key of your discord bot)
- APPLICATION_ID (this is the application id of your discord bot)\
\
**In the image generator stack:**
- HalfJourney/StableModelArn
- HalfJourney/ConnecionArn (this is the connection arn you will need to post to discord's webhook)

### **IMPORTANT**: 
the connectionArn is the arn for connection you will need to post to discord's webhook. This is required for http endpoint to work. You can make this connection arn via Eventbridge/ Integration/ Api destinations and go to the tab connections. since you dont need a secret, just put in a dummy apikey. 


# How to contact me
If you have any questions, feel free to contact me on LinkedIn: https://www.linkedin.com/in/jairjosafath/

I might post a tutorial on how to deploy this solution on my youtube channel: **COMING SOON**

## Steps:
All Discord bot related steps can be found in HalfJourney-v1 repository: https://github.com/JairJosafath/HalfJourney-v1

1. Create a connection in Eventbridge. Copy the arn.
2. Create the following parameters in Parameter store (same region as the ig stack):
    - /HalfJourney/ConnectionArn and paste the arn you copied in step 1 as the value.
    - /HalfJourney/StableModelArn and paste the arn of the model you want to use as the value.
3. Deploy the image generator stack.
4. Take note of the api gateway url in the request handler stack.

5. Create the following parameters in Parameter store (same region as the rh stack):
    - /HalfJourney/API-ig-Endpoint and paste the api gateway url you copied in step 4 as the value.\
    you only copy/paste <api_id>.execute-api.<region>.amazonaws.com
    - /HalfJourney/TitanModelArn and paste the arn of the model you want to use as the value.
    - /PUBLIC_KEY and paste the public key of your discord bot as the value.
    - /APPLICATION_ID and paste the application id of your discord bot as the value.
6. Deploy the request handler stack.
7. Copy the api gateway url from the rh stack and paste it in the discord bot's endpoint url.
8. To build your commands you can follow the steps on discord.dev. 
this is how I built my commands using postman
- endpoint https://discord.com/api/v10/applications/<app_id>/guilds/<guild_id>/commands\
this way your bot commands auto update, the guildid of your server can be found my turning on dev mode in discord and right clicking on your server.
- body: 
```json
{
  "name": "imagine",
  "type": 1,
  "description": "Generate an image based on the user's prompt",
  "options": [
    {
      "name": "prompt",
      "description": "Enter a prompt for the image",
      "type": 3,
      "required": true
    },
    {
      "name": "resolution",
      "description": "Image resolution",
      "type": 3,
      "choices": [
        {
          "name": "512x512",
          "value": "512",
          "default": true
        },
        {
          "name": "1024x1024",
          "value": "1024"
        }
      ],
      "required": false
    },
    {
      "name": "quality",
      "description": "Image quality (standard/premium)",
      "type": 3,
      "choices": [
        {
          "name": "standard",
          "value": "standard",
          "default": true
        },
        {
          "name": "premium",
          "value": "premium"
        }
      ],
      "required": false
    },
    {
      "name": "steps",
      "description": "Number of diffusion steps",
      "type": 3,
      "choices": [
        {
          "name": "30",
          "value": "30",
          "default": true
        },
        {
          "name": "40",
          "value": "40"
        },
        {
          "name": "50",
          "value": "50"
        },
        {
          "name": "70",
          "value": "70"
        }
      ],
      "required": false
    },
    {
      "name": "style",
      "description": "Style preset",
      "type": 3,
      "choices": [
        {
          "name": "3d-model",
          "value": "3d-model"
        },
        {
          "name": "analog-film",
          "value": "analog-film"
        },
        {
          "name": "anime",
          "value": "anime"
        },
        {
          "name": "cinematic",
          "value": "cinematic"
        },
        {
          "name": "comic-book",
          "value": "comic-book"
        },
        {
          "name": "digital-art",
          "value": "digital-art"
        },
        {
          "name": "enhance",
          "value": "enhance"
        },
        {
          "name": "fantasy-art",
          "value": "fantasy-art"
        },
        {
          "name": "isometric",
          "value": "isometric"
        },
        {
          "name": "line-art",
          "value": "line-art"
        },
        {
          "name": "low-poly",
          "value": "low-poly"
        },
        {
          "name": "modeling-compound",
          "value": "modeling-compound"
        },
        {
          "name": "neon-punk",
          "value": "neon-punk"
        },
        {
          "name": "origami",
          "value": "origami"
        },
        {
          "name": "photographic",
          "value": "photographic",
          "default": true
        },
        {
          "name": "pixel-art",
          "value": "pixel-art"
        },
        {
          "name": "tile-texture",
          "value": "tile-texture"
        }
      ],
      "required": false
    },
    {
      "name": "enhance_prompt",
      "description": "Enhance the prompt for better results",
      "type": 5,
      "choices": [
        {
          "name": "true",
          "value": true
        },
        {
          "name": "false",
          "value": false,
          "default": true
        }
      ],
      "required": false
    },
    {
      "name": "sampler",
      "description": "Choose a sampler",
      "type": 3,
      "choices": [
        {
          "name": "DDIM",
          "value": "DDIM"
        },
        {
          "name": "DDPM",
          "value": "DDPM"
        },
        {
          "name": "K_DPMPP_2M",
          "value": "K_DPMPP_2M"
        },
        {
          "name": "K_DPMPP_2S_ANCESTRAL",
          "value": "K_DPMPP_2S_ANCESTRAL",
          "default": true
        },
        {
          "name": "K_DPM_2",
          "value": "K_DPM_2"
        },
        {
          "name": "K_DPM_2_ANCESTRAL",
          "value": "K_DPM_2_ANCESTRAL"
        },
        {
          "name": "K_EULER",
          "value": "K_EULER"
        },
        {
          "name": "K_EULER_ANCESTRAL",
          "value": "K_EULER_ANCESTRAL"
        },
        {
          "name": "K_HEUN",
          "value": "K_HEUN"
        },
        {
          "name": "K_LMS",
          "value": "K_LMS"
        }
      ],
      "required": false
    },
    {
      "name": "cfg_scale",
      "description": "How strictly the diffusion process adheres to the prompt text, max 35",
      "type":4,
      "choices": [
        {
          "name": 7,
          "value": 7,
          "default": true
        },
        {
          "name": 20,
          "value": 20
        }
      ],
      "required": false
    }
  ]
}

```

### Enjoy your bot!

some cool images generated by the bot:
\
\
![image](/gen-imgs/1.png)
\
![image](/gen-imgs/2.png)
\
![image](/gen-imgs/3.webp)
\
![image](/gen-imgs/4.png)
\
![image](/gen-imgs/5.png)
