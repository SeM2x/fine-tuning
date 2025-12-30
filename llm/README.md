# LLM Fine-Tuning & Model Files

This directory contains all the resources for fine-tuning the Qwen2.5-3B model on Algerian Darija, converting it to GGUF format, and deploying it with Ollama.

## Overview

The fine-tuning process transforms the base Qwen2.5-3B-Instruct model into a specialized assistant that understands and responds in Algerian Darija. The workflow involves:

1. **Fine-tuning with LoRA** using Unsloth
2. **Converting to GGUF** for efficient inference
3. **Deploying with Ollama** using a custom Modelfile

## Contents

- `adapters.ipynb` - LoRA fine-tuning notebook (Colab/Kaggle)
- `gguf.ipynb` - Model conversion to GGUF format
- `final_train.json` - Training dataset (7,501 examples)
- `Modelfile` - Ollama configuration for model deployment
- `model_files.txt` - Links to model weights on Google Drive

## Fine-Tuning Process

### 1. LoRA Adapters Training

**Notebook**: [adapters.ipynb](adapters.ipynb)

**Base Model**: `unsloth/Qwen2.5-3B-Instruct-bnb-4bit`

**Configuration**:
```python
r = 64                    # High rank for vocabulary acquisition
lora_alpha = 128          # 2x rank for stable updates
target_modules = [        # All linear layers
    "q_proj", "k_proj", "v_proj", "o_proj",
    "gate_proj", "up_proj", "down_proj"
]
```

**Training Details**:
- **Sequence Length**: 2048 tokens
- **Quantization**: 4-bit (for 16GB VRAM compatibility)
- **Data Format**: Dual-mode (Chat + Text Completion)
  - **Chat Mode**: User/Assistant conversations
  - **Meaning Mode**: English-to-Darija translations
- **Framework**: Unsloth + TRL (SFTTrainer)

**Output**: LoRA adapter weights saved to Google Drive

### 2. GGUF Conversion

**Notebook**: [gguf.ipynb](gguf.ipynb)

Converts the fine-tuned model + adapters to GGUF format for efficient CPU/GPU inference.

**Quantization Method**: `Q4_K_M` (4-bit quantization)
- Reduces model size to ~2GB
- Minimal quality loss
- Optimized for Ollama

**Process**:
1. Load model + adapters from Drive
2. Convert locally on Colab VM (avoids storage limits)
3. Copy final GGUF file (~2GB) to Google Drive

### 3. Model Deployment

**File**: [Modelfile](Modelfile)

Ollama configuration that defines the model's behavior and personality.

**Key Features**:
- **Strict Darija Output**: Forces Arabic script responses
- **Temperature**: 0.1 (consistent, predictable responses)
- **Top-K**: 20 (focused vocabulary)
- **Repeat Penalty**: 1.2 (reduces repetition)
- **System Prompt**: "Khouya" personality - helpful Algerian assistant

**Template Format**: Qwen's `<|im_start|>` / `<|im_end|>` chat format

## Training Data

**File**: [final_train.json](final_train.json)

**Size**: 7,501 training examples

**Sources**:
1. **Original Darija Dataset**: 1,000 Algerian Darija messages from Hugging Face
2. **Translated Pairs**: English translations for meaning alignment
3. **Synthetic Data**: Generated conversations in Darija

**Format**:
```json
{
  "instruction": "User's question or context",
  "input": "Additional input (optional)",
  "output": "Model's response in Darija",
  "source": "synthetic|translated|original"
}
```

## Model Weights

Download the trained models from Google Drive:

- **LoRA Adapters**: [Google Drive Link](https://drive.google.com/drive/folders/12594lHMOAb_JLI0dIXnVKat8VABGp2EK?usp=sharing)
- **GGUF Model**: [Google Drive Link](https://drive.google.com/drive/folders/1T5hgLUsv6zaXWjk-zTnp8xyF1bmqOHmb?usp=sharing)

## Running with Ollama

### 1. Install Ollama

```bash
curl -fsSL https://ollama.com/install.sh | sh
```

### 2. Create Model from GGUF

```bash
# Download GGUF file from Google Drive
# Place it in this directory

# Create Ollama model
ollama create qwen_darja -f Modelfile
```

### 3. Test the Model

```bash
ollama run qwen_darja
```

### 4. Use in Backend

The Django backend connects to Ollama at `http://localhost:11434` and uses this model for inference.

## Training Environment

**Recommended Setup**:
- Google Colab (Free T4 GPU)
- 16GB VRAM minimum
- ~70GB disk space for intermediate files

**Runtime**: ~2-3 hours for full fine-tuning

## Technical Decisions

### Why Qwen2.5-3B?
- Lightweight (3B parameters) for resource-constrained environments
- Strong multilingual base
- Excellent instruction-following capabilities

### Why LoRA?
- Trains only 1-2% of parameters
- Requires <16GB VRAM
- Maintains base model knowledge

### Why Q4_K_M Quantization?
- Reduces model size by 75%
- Minimal quality degradation
- Fast inference on CPU

### Why Dual-Mode Training?
- **Chat Mode**: Learns conversational behavior
- **Meaning Mode**: Learns vocabulary and semantics
- Combined approach creates robust understanding

## Results

The fine-tuned model:
- ✅ Responds exclusively in Algerian Darija (Arabic script)
- ✅ Understands English/French questions and translates responses
- ✅ Maintains helpful, friendly personality ("Khouya")
- ✅ Runs efficiently on consumer hardware
- ✅ Integrates seamlessly with Ollama API

## References

- [Unsloth](https://github.com/unslothai/unsloth) - Efficient fine-tuning framework
- [Ollama](https://ollama.com) - Local LLM deployment
- [Qwen2.5](https://qwenlm.github.io) - Base model documentation
- [LoRA Paper](https://arxiv.org/abs/2106.09685) - Low-Rank Adaptation theory
