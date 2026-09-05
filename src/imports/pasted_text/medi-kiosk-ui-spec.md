Design a complete, modern, highly accessible healthcare kiosk/web application UI called **“MediKiosk – AI Patient Case Taking System”**.

The application is designed for Indian government hospitals and must be usable by elderly people, low-literacy users, rural patients, and people who are not comfortable with technology.

## CORE UX PRINCIPLES

Make the interface extremely simple, friendly, accessible, and touch-friendly.

* One question per screen only.
* Never show multiple medical questions on the same screen.
* Every question must be automatically spoken aloud using text-to-speech when the screen opens.
* Include a large, highly visible speaker/replay button so the patient can hear the question again.
* Use very large fonts.
* Use very large touch targets.
* Prefer buttons, cards, icons, yes/no choices, multiple-choice options, sliders, and toggles instead of typing.
* Minimize keyboard/text input.
* Use simple language.
* Support Hindi and English.
* Design the interface so that the same question can be displayed in Hindi or English.
* Use large recognizable icons together with text.
* Icons should be large enough to understand from a distance.
* Maintain strong contrast between background, text, buttons, and icons.
* Do not rely on color alone to communicate meaning.
* Use clear visual states for selected/unselected buttons.
* Include a clearly visible progress bar on every question screen.
* Include a persistent “Help” toggle/button that can be turned ON or OFF.
* When Help is ON, show additional visual/audio guidance explaining what the patient should do.
* Provide a large “Repeat Question 🔊” button.
* Provide “Back” and “Next” navigation with large touch targets.
* Avoid small links, tiny icons, dense tables, complicated menus, and unnecessary animations.
* Use rounded cards and generous spacing.
* The design should feel trustworthy and appropriate for a government hospital rather than like a commercial fitness app.

## VISUAL STYLE

Use a clean, modern healthcare design.

Color requirements:

* High-contrast interface.
* Light background with dark text.
* Strong contrasting primary action button.
* Use green/blue tones associated with healthcare, but maintain WCAG-friendly contrast.
* Red should only be used for emergency/red-flag alerts.
* Avoid pastel text that is difficult to read.
* Use large white-space areas.
* Use simple, consistent iconography.
* Use rounded rectangular buttons with clear labels.
* Use a large readable font such as Inter, Noto Sans, or a similar highly legible font.
* Hindi text must use a font with excellent Devanagari support such as Noto Sans Devanagari.

## SCREEN 1 — WELCOME

Create a large, welcoming kiosk screen.

Title:
“Welcome to MediKiosk”

Subtitle:
“Your AI-assisted health history”

Large illustration/icon:
A friendly patient talking to an AI healthcare assistant.

Large buttons:
“Start”
“Language / भाषा”

Language choices:
🇮🇳 हिंदी
🇬🇧 English

Include a visible speaker icon and an accessibility/help button.

## SCREEN 2 — CONSENT

Show one simple consent question.

Large heading:
“Can we record your answers to prepare your medical history?”

Large microphone/speaker icon.

Buttons:
“Yes, I Agree”
“No, Cancel”

Include:
“🔊 Listen to this information”

Use simple language and audio guidance.

## SCREEN 3 — PATIENT IDENTIFICATION

Ask only:

“What is your ABHA ID?”

Provide:

* Large scan QR/ABHA button
* Large “I don't have ABHA” button
* Large “Continue as new patient” button

Do not force typing if it can be avoided.

Include visual scanning illustration.

## SCREEN 4 — MAIN COMPLAINT

One question only:

“What problem are you having today?”

Large microphone icon in the center.

Large button:
“🎙️ Speak your answer”

Also provide common complaint cards with large icons:

❤️ Chest pain
🤕 Headache
🌡️ Fever
🫁 Breathing problem
🤢 Stomach problem
🦴 Pain
➕ Something else

Allow the patient to either speak or tap.

## SCREEN 5 — DURATION

Example question:

“How long have you had this problem?”

Large clock/calendar icon.

Large touch buttons:

Today
2–3 days
Less than a week
1–4 weeks
More than a month
I don't know

No typing.

## SCREEN 6 — SEVERITY

Question:

“How severe is your problem?”

Use a very large visual severity scale.

Buttons:

🙂 Mild
😐 Moderate
😣 Severe
🚨 Very severe

Make each option a large touch target.

## SCREEN 7 — LOCATION

Question:

“Where do you feel the problem?”

Use a large simplified human-body illustration.

Allow the patient to tap body areas.

Also provide large buttons:

Head
Chest
Stomach
Back
Arm
Leg
Whole body
Other

## SCREEN 8 — SYMPTOM FOLLOW-UP

The screen must demonstrate adaptive questioning.

For example, if the patient selected chest pain:

Question:
“Does the pain spread to your arm, shoulder, neck, or jaw?”

Large icon showing pain spreading from chest.

Buttons:

Yes
No
Not sure

The UI should make it clear that the next question changes according to the patient's previous answer.

## SCREEN 9 — MEDICAL CONDITIONS

Question:

“Do you have any existing health problems?”

Large disease icons.

Large selectable cards:

Diabetes
High BP
Heart disease
Asthma
Kidney disease
Thyroid
None
Other

Allow multiple selection.

## SCREEN 10 — MEDICINES

Question:

“Are you currently taking any medicines?”

Large medicine/pill icon.

Buttons:

Yes
No
Not sure

If Yes, provide an optional large “Scan Prescription” button instead of requiring typing.

## SCREEN 11 — ALLERGIES

Question:

“Are you allergic to any medicine or food?”

Large allergy/warning icon.

Buttons:

Yes
No
Not sure

If Yes, provide large selectable options and optional voice input.

## SCREEN 12 — FAMILY HISTORY

Question:

“Does anyone in your family have a similar or major health problem?”

Large family icon.

Buttons:

Yes
No
Not sure

## SCREEN 13 — PERSONAL / LIFESTYLE HISTORY

Ask one question at a time.

Examples:

“Do you smoke?”

“Yes / No”

Then:

“Do you drink alcohol?”

“Yes / No”

Then:

“How active are you during the day?”

Use large visual choices instead of typing.

## SCREEN 14 — REVIEW OF SYSTEMS

Ask one symptom at a time.

Example:

“Are you having difficulty breathing?”

Large lungs icon.

Buttons:

Yes
No
Not sure

The AI should automatically move through relevant questions.

## SCREEN 15 — MEDICAL DOCUMENT SCANNING

Create a simple document upload/scan screen.

Heading:
“Do you have previous medical reports?”

Large document scanner illustration.

Large buttons:

📷 Scan Document
📁 Upload Document
⏭️ I don't have reports

Show supported documents:

Prescription
Blood Test
Discharge Summary
Medical Report
Imaging Report

## SCREEN 16 — OCR PROCESSING

Show an understandable AI processing screen.

Example:

“Reading your medical document…”

Show document preview.

Processing steps:

✓ Document detected
✓ Text extracted
✓ Medicines identified
✓ Test results identified
✓ Date identified

Do not use technical AI terminology.

## SCREEN 17 — DOCUMENT RESULTS

Show extracted information in large cards.

Example:

Diagnosis:
Hypertension

Medicine:
Amlodipine 5 mg

Blood Pressure:
150/95 ⚠

Date:
12 August 2026

Include:

“Check information”

“Scan another document”

Make it clear that the patient can correct incorrect information.

## SCREEN 18 — RED FLAG ALERT

Create a separate emergency design.

If the AI detects potentially dangerous symptoms, immediately show:

🚨 “Priority Attention Needed”

Example:

“Your answers indicate symptoms that may need urgent medical attention.”

Large alert icon.

Buttons:

“Call / Alert Hospital Staff”
“Continue only if staff says it is safe”

Do NOT display an AI diagnosis.

Clearly state:

“This is not a diagnosis. A healthcare professional will assess you.”

## SCREEN 19 — MEDICAL TIMELINE

Create a visual chronological timeline.

Example:

2024
Previous diagnosis

2025
Prescription

2026
Blood test

Today
Current symptoms

Use large cards and icons.

Allow the doctor/patient to understand the patient's previous medical history quickly.

## SCREEN 20 — FINAL PATIENT REVIEW

Show a simple confirmation screen.

Heading:

“Please check your information”

Display large cards:

Main problem
Duration
Severity
Existing conditions
Medicines
Allergies
Previous reports

Each card has:

✏️ Edit

Large button:

“Everything is correct → Submit”

## SCREEN 21 — PROCESSING SUMMARY

Show:

“Preparing your medical history…”

Then:

✓ Patient information
✓ Symptoms
✓ Medical history
✓ Medicines
✓ Allergies
✓ Previous reports
✓ Investigation results

## SCREEN 22 — COMPLETED

Large success screen.

“Your medical history is ready.”

Subtitle:

“Please wait for the doctor.”

Large checkmark icon.

Show:

“Your information has been sent to the healthcare team.”

## DOCTOR DASHBOARD

Create a separate desktop/tablet dashboard for doctors.

The doctor should immediately see a structured summary.

Header:

“MediKiosk – Patient Clinical Summary”

Patient information:
Name
Age
Gender
ABHA ID
Language
Registration number

Create sections:

1. Chief Complaint
2. History of Present Illness
3. Past Medical History
4. Past Surgical History
5. Current Medications
6. Drug/Food Allergies
7. Family History
8. Personal History
9. Review of Systems
10. Previous Investigations
11. Medical Document Timeline
12. AI Red-Flag Alerts

Use visual priority indicators for abnormal results.

Include buttons:

“Edit”
“Confirm”
“View Original Document”
“View Patient Answers”

Important:
The AI summary must always be presented as a DRAFT for physician verification.

Never present AI-generated information as a confirmed diagnosis.

## AYUSH MODE

Add a separate mode for AYUSH/Ayurvedic OPDs.

When AYUSH mode is selected, use the same one-question-per-screen design.

Ask questions covering:

Prakriti
Vikriti
Sara
Samhanana
Pramana
Satmya
Sattva
Ahara Shakti
Vyayama Shakti
Vaya
Ahara
Vihara

Use illustrations and large selectable options wherever possible.

## HELP MODE

Every patient question screen must contain a clearly visible:

“❓ Help”

toggle.

When Help is ON:

* Show a short explanation.
* Show a relevant illustration.
* Automatically speak the explanation.
* Give an example answer where appropriate.

Example:

Question:
“Where does it hurt?”

Help:
“Tap the part of your body where you feel pain.”

Show a body illustration with highlighted touch areas.

## ACCESSIBILITY REQUIREMENTS

Apply these rules throughout the entire design:

* Minimum large touch targets.
* Large typography.
* High contrast.
* One question per screen.
* Large icons.
* Text + icon together.
* Audio automatically plays for every question.
* Repeat audio button always visible.
* Voice input always available where appropriate.
* Touch input always available.
* Avoid typing wherever possible.
* Clear Back and Next buttons.
* Visible progress bar on every question.
* Show progress such as “Question 4 of 15”.
* Keep navigation consistent.
* Avoid unnecessary scrolling.
* Avoid complex menus.
* Use simple Hindi and English wording.
* Make the design usable by someone who has never used a healthcare application before.

## PROGRESS BAR

Every question screen must contain a prominent progress indicator at the top.

Example:

“Medical History — Question 5 of 15”

[████████░░░░░░░]

The progress indicator should clearly show how much of the interview has been completed.

## COMPONENT SYSTEM

Create reusable Figma components for:

* Question card
* Large answer button
* Yes/No button
* Multiple-choice card
* Icon + text option
* Microphone button
* Speaker/replay button
* Help toggle
* Progress bar
* Back button
* Next button
* Emergency alert
* Document card
* Medical timeline card
* AI processing indicator
* Doctor summary section
* Edit/Confirm controls

Create desktop/tablet kiosk layouts and responsive versions.

The final design should look like a real production-ready healthcare kiosk rather than a conceptual mockup.

Prioritize:
**Simplicity → Accessibility → Voice → Touch → Medical clarity → Trust → Safety.**
