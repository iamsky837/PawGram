# 🧬 PawGram Clone Build Architecture

> [!NOTE]
> **Internal Developer Documentation**
> 
> This document describes the clone build architecture used by PawGram. It is intended for contributors and developers who wish to understand how official PawGram packages are produced. 
>
> Unlike a user installation guide, this page exists to document the project's technical implementation strategy as part of the repository's open-source documentation.

---

## 📖 Background

PawGram is distributed exclusively as a cloned package rather than a replacement build of Instagram. 

Maintaining a dedicated package namespace allows PawGram to coexist with the original Instagram installation while providing a consistent deployment target for project development and testing. 

During early development, multiple cloning techniques were evaluated. Each solved a different aspect of the packaging process but also introduced individual limitations. The current build pipeline combines two independent cloning methods into a single release artifact. This hybrid approach has proven to provide the highest compatibility and the lowest number of runtime issues across supported devices.

---

## ⚙️ Build Pipeline

The official PawGram build consists of three sequential stages:

```text
                Original Instagram APK
                         │
                         ▼
        ┌─────────────────────────────────┐
        │   Stage 1 • Legacy DEX Clone    │
        └─────────────────────────────────┘
                         │
                   Clone Build A
              (Runtime DEX Artifacts)
                         │
                         ▼
        ┌─────────────────────────────────┐
        │    Stage 2 • Resource Clone     │
        │         resources.arsc          │
        │       AndroidManifest.xml       │
        └─────────────────────────────────┘
                         │
                   Clone Build B
           (Package Identity & Resources)
                         │
                         ▼
        ┌─────────────────────────────────┐
        │    Stage 3 • Artifact Merge     │
        └─────────────────────────────────┘
                         │
               Copy all classes*.dex 
             from Build A into Build B
                         │
                         ▼
                   Auto Sign APK
                         │
                         ▼
              Official PawGram Build

```
### Stage 1 — Legacy DEX Clone
The first stage creates a cloned application using the traditional DEX-based cloning method. This process primarily focuses on generating the application's executable bytecode. The resulting build preserves the runtime structure required for application execution.
**Generated Artifacts:**
 * classes.dex
 * classes2.dex
 * classes3.dex
 * *Additional DEX files (when applicable)*
These files are retained for use during the final merge stage.
*(Note: This build is referred to throughout this document as **Build A**).*
### Stage 2 — Package Identity Clone
The second stage creates an entirely separate clone using modifications to the application's package metadata. Rather than focusing on executable code, this stage establishes a unique application identity, allowing the clone to coexist independently from the original installation.
This process operates primarily on:
 * AndroidManifest.xml
 * resources.arsc
The output of this stage becomes the destination package for the final merge.
*(Note: This build is referred to throughout this document as **Build B**).*
### Stage 3 — Build Merge
Once both intermediate builds have been generated, the final release package is assembled. Every runtime DEX artifact generated during Stage 1 is transferred into the package produced during Stage 2.
**Conceptual Workflow:**
```text
       Build A                              Build B
       │                                    │
       ├── classes.dex                      ├── AndroidManifest.xml
       ├── classes2.dex     ────────►       ├── resources.arsc
       ├── classes3.dex                     ├── classes.dex   (replaced)
       └── ...                              ├── classes2.dex  (replaced)
                                            ├── classes3.dex  (replaced)
                                            └── ...

```
**After merging, the package contains:**
 * Runtime implementation from the DEX clone.
 * Package identity from the resource clone.
 * Application resources generated during the package cloning process.
The merged APK becomes the official PawGram release candidate.
## 🔐 APK Signing
Before rebuilding the merged package, enable automatic signing within MT Manager.
 * **[✓] Auto Sign**
Automatic signing ensures that the resulting APK is immediately installable after compilation.
## 🏗️ Design Rationale
Neither cloning technique independently satisfied all project requirements. Combining the strengths of both methods significantly improves overall reliability.
| Clone Method | Strengths | Limitations |
|---|---|---|
| **Legacy DEX Clone** | Reliable runtime bytecode generation. | Package identity is less reliable. |
| **Resource Clone** | Stable package isolation and application identity. | Runtime compatibility is inconsistent when used independently. |
This hybrid workflow reduces compatibility issues observed during testing and has therefore been adopted as the project's reference build architecture.
## 📊 Build Characteristics
The official PawGram build pipeline provides:
 * Stable cloned package generation.
 * Independent application package identity.
 * Improved runtime compatibility.
 * Minimal observed cloning-related issues.
 * A reproducible developer workflow.
 * A consistent release generation process.
## 📱 Compatibility
PawGram currently targets **clone package installations only**. Supporting a single deployment strategy simplifies maintenance, testing, and release validation while providing a consistent installation experience across supported devices.
## 🛠️ Tooling
The current development workflow utilizes the following tools:
| Tool | Purpose |
|---|---|
| **MT Manager** | APK cloning, merging, rebuilding, and signing. |
| **APK Editor Pro** *(Optional)* | Custom application name and launcher icon modifications. |
*The optional customization step does not affect the cloning architecture described in this document.*
## 📂 Repository Scope & License
This document is provided to explain how official PawGram builds are produced. It documents the architecture of the project's build pipeline for contributors and serves as technical reference material alongside the source code. Future revisions may simplify this workflow as improved cloning techniques become available.
This documentation is part of the PawGram project and is distributed under the same license as the repository unless otherwise specified.
