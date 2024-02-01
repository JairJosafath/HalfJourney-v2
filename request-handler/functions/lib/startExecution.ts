import { SFNClient, StartExecutionCommand } from "@aws-sdk/client-sfn";

const STATE_MACHINE_ARN = process.env.STATE_MACHINE_ARN;
const APPLICATION_ID = process.env.APPLICATION_ID;
const emojis = ["🥳", "🎉", "😎", "🚀", "🌟", "🔥", "🎊", "👏", "💥", "👍", "😊"];

const client = new SFNClient();

export async function startExecution(discordEvent: any) {
    const { options } = discordEvent.data;
    const { user } = discordEvent.member;

    // Default input
    const defaultInput = {
        enhanced: false,
        userId: user.id,
        username: user.username,
        interactionId: discordEvent.id,
        interactionToken: discordEvent.token,
        prompt: "",
        key: `public/${user.id}/${discordEvent.id}/image.png`,
        interactionUrl: `https://discord.com/api/webhooks/${APPLICATION_ID}/${discordEvent.token}`,
        params: {
            width: 512,
            height: 512,
            quality: "standard",
            steps: 30,
            style: "photographic",
            enhancePrompt: false,
            sampler: "K_DPMPP_2S_ANCESTRAL",
            cfgScale: 7,
        },
    };

    // Update default input with provided options
    const input = {
        ...defaultInput,
        prompt: options?.[0]?.value || defaultInput.prompt,
        params: {
            ...defaultInput.params,
            width: parseInt(options?.[1]?.value) || defaultInput.params.width,
            height: parseInt(options?.[1]?.value) || defaultInput.params.height,
            quality: options?.[2]?.value || defaultInput.params.quality,
            steps: parseInt(options?.[3]?.value) || defaultInput.params.steps,
            style: options?.[4]?.value || defaultInput.params.style,
            enhancePrompt: options?.[5]?.value || defaultInput.params.enhancePrompt,
            sampler: options?.[6]?.value || defaultInput.params.sampler,
            cfgScale: parseInt(options?.[7]?.value) || defaultInput.params.cfgScale,
        },
    };

    const res = await client.send(
        new StartExecutionCommand({
            stateMachineArn: STATE_MACHINE_ARN,
            input: JSON.stringify(input),
        })
    );

    console.log({ res });

    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
    return {
        statusCode: 200,
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            type: 4,
            data: {
                content: `Generating your image, please wait ${randomEmoji}\n## your prompt is\n \`\`\` ${input.prompt}\`\`\``,
            },
        }),
    };
}
