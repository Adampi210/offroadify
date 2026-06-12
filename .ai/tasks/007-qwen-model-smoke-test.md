# Task: Load Qwen-Image-Edit-2511 and run one local edit

## Status

- [ ] planned
- [ ] in progress
- [ ] implemented
- [ ] reviewed
- [ ] done

## Goal

Add the Qwen dependencies and a CLI smoke test that loads `Qwen/Qwen-Image-Edit-2511`, edits one local car image, and writes one PNG.

Do not expose HTTP inference yet.

## Official baseline

Use `QwenImageEditPlusPipeline` with:

```text
model: Qwen/Qwen-Image-Edit-2511
dtype: bfloat16
true_cfg_scale: 4.0
guidance_scale: 1.0
num_inference_steps: 40
negative_prompt: " "
num_images_per_prompt: 1
```

Use a deterministic seed.

## Dependencies

Add compatible versions of:

- PyTorch with the correct CUDA build
- latest compatible Diffusers
- Transformers >= 4.51.3
- Accelerate
- Safetensors
- Pillow
- Hugging Face Hub

Pin resolved versions after a successful run.

## Proposed files

```text
services/qwen-inference/src/offroadify_inference/model.py
services/qwen-inference/src/offroadify_inference/smoke_test.py
```

## Device profiles

Implement configuration for:

- `cuda`: BF16 on CUDA
- `cpu-offload`: Diffusers model CPU offload for a single GPU

Do not add unofficial quantized checkpoints in this task.

If the machine cannot run either profile, fail clearly and record GPU, VRAM, RAM, CUDA version, and exact error.

## CLI

```bash
uv run python -m offroadify_inference.smoke_test   --input /absolute/path/to/car.jpg   --output /absolute/path/to/offroadified.png   --profile cuda   --seed 0
```

## Requirements

- Load pipeline once per process.
- Convert input to RGB.
- Use `torch.inference_mode()`.
- Save PNG.
- Log load time, generation time, and selected profile.
- Keep model cache outside Git.
- No HTTP endpoint.
- No Next.js modifications.
- Do not commit or push automatically.

## Acceptance criteria

- [ ] Dependencies resolve.
- [ ] Model loads or a clear hardware-blocked report is produced.
- [ ] One input produces one PNG when hardware permits.
- [ ] Seed and parameters are recorded.
- [ ] No weights appear in Git status.
