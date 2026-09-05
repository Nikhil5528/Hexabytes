import { useState, useEffect, useCallback } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

type Screen =
  | 'welcome' | 'consent' | 'patient-id'
  | 'main-complaint' | 'duration' | 'severity' | 'location'
  | 'symptom-followup' | 'medical-conditions' | 'medicines'
  | 'allergies' | 'family-history' | 'lifestyle-smoke'
  | 'lifestyle-alcohol' | 'lifestyle-activity' | 'review-systems'
  | 'documents' | 'ocr-processing' | 'document-results'
  | 'red-flag' | 'medical-timeline' | 'final-review'
  | 'processing' | 'completed'
  | 'doctor-dashboard' | 'ayush-mode';

type Lang = 'en' | 'hi';

interface Answers {
  complaint?: string;
  duration?: string;
  severity?: string;
  locations?: string[];
  spreadsPain?: string;
  conditions?: string[];
  medicines?: string;
  allergies?: string;
  familyHistory?: string;
  smokes?: string;
  alcohol?: string;
  activity?: string;
  breathingDiff?: string;
  hasDocuments?: string;
}

// ─── Screen Flow ──────────────────────────────────────────────────────────────

const QUESTION_SCREENS: Screen[] = [
  'main-complaint', 'duration', 'severity', 'location',
  'symptom-followup', 'medical-conditions', 'medicines',
  'allergies', 'family-history', 'lifestyle-smoke',
  'lifestyle-alcohol', 'lifestyle-activity', 'review-systems', 'documents',
];

const SCREEN_FLOW: Screen[] = [
  'welcome', 'consent', 'patient-id',
  ...QUESTION_SCREENS,
  'ocr-processing', 'document-results',
  'medical-timeline', 'final-review', 'processing', 'completed',
];

function nextScreen(current: Screen, answers: Answers): Screen {
  if (current === 'severity' && answers.severity === 'very-severe') return 'red-flag';
  if (current === 'red-flag') return 'location';
  if (current === 'documents') {
    return answers.hasDocuments === 'yes' ? 'ocr-processing' : 'medical-timeline';
  }
  if (current === 'ocr-processing') return 'document-results';
  if (current === 'document-results') return 'medical-timeline';
  const idx = SCREEN_FLOW.indexOf(current);
  return idx >= 0 && idx < SCREEN_FLOW.length - 1 ? SCREEN_FLOW[idx + 1] : 'completed';
}

function prevScreen(current: Screen): Screen {
  if (current === 'red-flag') return 'severity';
  const idx = SCREEN_FLOW.indexOf(current);
  return idx > 0 ? SCREEN_FLOW[idx - 1] : 'welcome';
}

// ─── Translations ─────────────────────────────────────────────────────────────

const T = {
  en: {
    welcomeTitle: 'Welcome to MediKiosk',
    welcomeSubtitle: 'AI-Assisted Patient Case Taking System',
    start: 'Start',
    langBtn: 'Language / भाषा',
    doctorMode: 'Doctor Dashboard',
    ayushMode: 'AYUSH / Ayurvedic Mode',
    helpBtn: '❓ Help',
    repeatBtn: '🔊 Repeat Question',
    back: '← Back',
    next: 'Next →',
    questionLabel: 'Question',
    ofLabel: 'of',
    yes: 'Yes',
    no: 'No',
    notSure: 'Not Sure',
    consentQ: 'Can we record your answers to prepare your medical history?',
    consentYes: '✅  Yes, I Agree',
    consentNo: '❌  No, Cancel',
    listenInfo: '🔊 Listen to this information',
    patientIdQ: 'What is your ABHA ID?',
    scanQR: '📷  Scan QR / ABHA Card',
    noAbha: 'I don\'t have ABHA ID',
    newPatient: 'Continue as New Patient',
    patientIdHelp: 'Your ABHA ID is a unique health ID card. You can scan it or continue without it.',
    complaintQ: 'What problem are you having today?',
    speakAnswer: '🎙️  Speak your answer',
    complaintHelp: 'Tap the button below that best matches your problem, or speak your answer.',
    durationQ: 'How long have you had this problem?',
    durationHelp: 'Tap the option that best describes how long you have had this problem.',
    today: 'Today',
    twoDays: '2–3 days',
    lessThanWeek: 'Less than a week',
    oneToFourWeeks: '1–4 weeks',
    moreThanMonth: 'More than a month',
    dontKnow: 'I don\'t know',
    severityQ: 'How severe is your problem?',
    severityHelp: 'Tap the face that best shows how bad your problem feels.',
    mild: 'Mild',
    moderate: 'Moderate',
    severe: 'Severe',
    verySevere: 'Very Severe',
    locationQ: 'Where do you feel the problem?',
    locationHelp: 'Tap all the parts of your body where you feel pain or discomfort.',
    head: 'Head',
    chest: 'Chest',
    stomach: 'Stomach',
    backBody: 'Back',
    arm: 'Arm',
    leg: 'Leg',
    wholeBody: 'Whole Body',
    other: 'Other',
    followupQ: 'Does the pain spread to your arm, shoulder, neck, or jaw?',
    followupHelp: 'Tap Yes if you feel the pain moving to your arm, shoulder, neck or jaw.',
    conditionsQ: 'Do you have any existing health problems?',
    conditionsHelp: 'Tap all conditions that apply to you. You can select more than one.',
    diabetes: 'Diabetes',
    highBP: 'High BP',
    heartDisease: 'Heart Disease',
    asthma: 'Asthma',
    kidneyDisease: 'Kidney Disease',
    thyroid: 'Thyroid',
    none: 'None',
    medicinesQ: 'Are you currently taking any medicines?',
    medicinesHelp: 'Tap Yes if you are taking any tablets, injections, or other medicines.',
    scanPrescription: '📷  Scan Prescription',
    allergiesQ: 'Are you allergic to any medicine or food?',
    allergiesHelp: 'Tap Yes if any medicine or food has caused redness, swelling, or breathing problems.',
    familyQ: 'Does anyone in your family have a similar or major health problem?',
    familyHelp: 'Think about your parents, siblings, or children.',
    smokeQ: 'Do you smoke?',
    smokeHelp: 'This includes cigarettes, bidi, hookah, or any tobacco products.',
    alcoholQ: 'Do you drink alcohol?',
    alcoholHelp: 'This includes any alcoholic beverages.',
    activityQ: 'How active are you during the day?',
    activityHelp: 'Think about how much you walk or do physical work every day.',
    veryActive: 'Very Active',
    moderatelyActive: 'Moderately Active',
    lightActivity: 'Light Activity',
    sedentary: 'Mostly Sitting',
    breathingQ: 'Are you having difficulty breathing?',
    breathingHelp: 'Tap Yes if you feel short of breath or difficulty taking a deep breath.',
    documentsQ: 'Do you have previous medical reports?',
    documentsHelp: 'You can scan or upload old prescriptions, blood tests, or hospital papers.',
    scanDoc: '📷  Scan Document',
    uploadDoc: '📁  Upload Document',
    noReports: '⏭️  I don\'t have reports',
    ocrTitle: 'Reading your medical document…',
    docDetected: 'Document detected',
    textExtracted: 'Text extracted',
    medsIdentified: 'Medicines identified',
    resultsIdentified: 'Test results identified',
    dateIdentified: 'Date identified',
    docResultTitle: 'Information found in your document',
    checkInfo: '✅  Check Information',
    scanAnother: '📷  Scan Another Document',
    redFlagTitle: '🚨 Priority Attention Needed',
    redFlagMsg: 'Your answers indicate symptoms that may need urgent medical attention.',
    callStaff: '🚨  Call / Alert Hospital Staff',
    continueIfSafe: 'Continue only if staff says it is safe',
    notDiagnosis: 'This is not a diagnosis. A healthcare professional will assess you.',
    timelineTitle: 'Your Medical History',
    reviewTitle: 'Please check your information',
    editBtn: '✏️ Edit',
    submitBtn: '✅  Everything is Correct — Submit',
    processingTitle: 'Preparing your medical history…',
    completedTitle: 'Your medical history is ready.',
    completedSubtitle: 'Please wait for the doctor.',
    sentToTeam: 'Your information has been sent to the healthcare team.',
    doctorTitle: 'MediKiosk – Patient Clinical Summary',
    aiDraft: '⚠️  AI-generated draft — awaiting physician verification',
    ayushTitle: 'AYUSH / Ayurvedic Assessment',
    prakritiQ: 'What is your body type?',
    vata: 'Vata (Thin, light)',
    pitta: 'Pitta (Medium, warm)',
    kapha: 'Kapha (Heavy, strong)',
    notKnown: 'I don\'t know',
    helpOn: 'Help ON',
    helpOff: 'Help',
  },
  hi: {
    welcomeTitle: 'MediKiosk में आपका स्वागत है',
    welcomeSubtitle: 'AI-सहायक रोगी इतिहास प्रणाली',
    start: 'शुरू करें',
    langBtn: 'Language / भाषा',
    doctorMode: 'डॉक्टर डैशबोर्ड',
    ayushMode: 'आयुष / आयुर्वेदिक मोड',
    helpBtn: '❓ सहायता',
    repeatBtn: '🔊 प्रश्न दोहराएँ',
    back: '← वापस',
    next: 'आगे →',
    questionLabel: 'प्रश्न',
    ofLabel: 'में से',
    yes: 'हाँ',
    no: 'नहीं',
    notSure: 'निश्चित नहीं',
    consentQ: 'क्या हम आपकी चिकित्सा इतिहास तैयार करने के लिए आपके उत्तर रिकॉर्ड कर सकते हैं?',
    consentYes: '✅  हाँ, मैं सहमत हूँ',
    consentNo: '❌  नहीं, रद्द करें',
    listenInfo: '🔊 यह जानकारी सुनें',
    patientIdQ: 'आपकी ABHA ID क्या है?',
    scanQR: '📷  QR / ABHA कार्ड स्कैन करें',
    noAbha: 'मेरे पास ABHA ID नहीं है',
    newPatient: 'नए मरीज़ के रूप में जारी रखें',
    patientIdHelp: 'ABHA ID आपका स्वास्थ्य पहचान पत्र है। आप इसे स्कैन कर सकते हैं या बिना इसके जारी रख सकते हैं।',
    complaintQ: 'आज आपको क्या समस्या है?',
    speakAnswer: '🎙️  अपना जवाब बोलें',
    complaintHelp: 'नीचे दिए गए बटन पर टैप करें जो आपकी समस्या से मेल खाता हो, या अपना जवाब बोलें।',
    durationQ: 'यह समस्या आपको कितने समय से है?',
    durationHelp: 'उस विकल्प पर टैप करें जो बताता है कि यह समस्या कितने समय से है।',
    today: 'आज',
    twoDays: '2–3 दिन',
    lessThanWeek: 'एक हफ्ते से कम',
    oneToFourWeeks: '1–4 हफ्ते',
    moreThanMonth: 'एक महीने से ज़्यादा',
    dontKnow: 'मुझे नहीं पता',
    severityQ: 'आपकी समस्या कितनी गंभीर है?',
    severityHelp: 'वह चेहरा टैप करें जो बताता है कि आपकी समस्या कितनी बुरी लग रही है।',
    mild: 'हल्की',
    moderate: 'मध्यम',
    severe: 'गंभीर',
    verySevere: 'बहुत गंभीर',
    locationQ: 'आपको कहाँ समस्या महसूस हो रही है?',
    locationHelp: 'शरीर के उन सभी हिस्सों पर टैप करें जहाँ आपको दर्द या परेशानी है।',
    head: 'सिर',
    chest: 'छाती',
    stomach: 'पेट',
    backBody: 'पीठ',
    arm: 'बाँह',
    leg: 'पैर',
    wholeBody: 'पूरा शरीर',
    other: 'अन्य',
    followupQ: 'क्या दर्द आपकी बाँह, कंधे, गर्दन या जबड़े तक फैलता है?',
    followupHelp: 'हाँ टैप करें अगर दर्द बाँह, कंधे, गर्दन या जबड़े तक जाता है।',
    conditionsQ: 'क्या आपको कोई पुरानी बीमारी है?',
    conditionsHelp: 'सभी लागू बीमारियाँ टैप करें। एक से अधिक चुन सकते हैं।',
    diabetes: 'मधुमेह',
    highBP: 'उच्च रक्तचाप',
    heartDisease: 'हृदय रोग',
    asthma: 'दमा',
    kidneyDisease: 'गुर्दे की बीमारी',
    thyroid: 'थायरॉइड',
    none: 'कोई नहीं',
    medicinesQ: 'क्या आप अभी कोई दवाई ले रहे हैं?',
    medicinesHelp: 'हाँ टैप करें अगर आप कोई गोली, इंजेक्शन या अन्य दवाई ले रहे हैं।',
    scanPrescription: '📷  पर्चा स्कैन करें',
    allergiesQ: 'क्या आपको किसी दवाई या खाने से एलर्जी है?',
    allergiesHelp: 'हाँ टैप करें अगर किसी दवाई या खाने से लालिमा, सूजन या सांस की समस्या हुई हो।',
    familyQ: 'क्या आपके परिवार में किसी को कोई बड़ी बीमारी है?',
    familyHelp: 'माता-पिता, भाई-बहन या बच्चों के बारे में सोचें।',
    smokeQ: 'क्या आप धूम्रपान करते हैं?',
    smokeHelp: 'इसमें सिगरेट, बीड़ी, हुक्का या कोई भी तम्बाकू उत्पाद शामिल है।',
    alcoholQ: 'क्या आप शराब पीते हैं?',
    alcoholHelp: 'इसमें कोई भी मादक पेय शामिल है।',
    activityQ: 'आप दिन में कितने सक्रिय रहते हैं?',
    activityHelp: 'सोचें कि आप हर दिन कितना चलते हैं या शारीरिक काम करते हैं।',
    veryActive: 'बहुत सक्रिय',
    moderatelyActive: 'मध्यम सक्रिय',
    lightActivity: 'हल्की गतिविधि',
    sedentary: 'ज़्यादातर बैठे रहना',
    breathingQ: 'क्या आपको सांस लेने में कठिनाई हो रही है?',
    breathingHelp: 'हाँ टैप करें अगर सांस छोटी है या गहरी सांस लेने में परेशानी है।',
    documentsQ: 'क्या आपके पास पुराने चिकित्सा रिपोर्ट हैं?',
    documentsHelp: 'आप पुराने पर्चे, रक्त परीक्षण, या अस्पताल के कागज़ात स्कैन या अपलोड कर सकते हैं।',
    scanDoc: '📷  दस्तावेज़ स्कैन करें',
    uploadDoc: '📁  दस्तावेज़ अपलोड करें',
    noReports: '⏭️  मेरे पास रिपोर्ट नहीं है',
    ocrTitle: 'आपका चिकित्सा दस्तावेज़ पढ़ा जा रहा है…',
    docDetected: 'दस्तावेज़ मिला',
    textExtracted: 'टेक्स्ट निकाला गया',
    medsIdentified: 'दवाइयाँ पहचानी गईं',
    resultsIdentified: 'परीक्षण परिणाम पहचाने गए',
    dateIdentified: 'तारीख पहचानी गई',
    docResultTitle: 'आपके दस्तावेज़ में मिली जानकारी',
    checkInfo: '✅  जानकारी जाँचें',
    scanAnother: '📷  दूसरा दस्तावेज़ स्कैन करें',
    redFlagTitle: '🚨 तत्काल ध्यान आवश्यक',
    redFlagMsg: 'आपके उत्तर ऐसे लक्षण दर्शाते हैं जिन्हें तुरंत चिकित्सा ध्यान की आवश्यकता हो सकती है।',
    callStaff: '🚨  अस्पताल स्टाफ को बुलाएँ / अलर्ट करें',
    continueIfSafe: 'केवल तभी जारी रखें जब स्टाफ कहे कि सुरक्षित है',
    notDiagnosis: 'यह कोई निदान नहीं है। एक स्वास्थ्य पेशेवर आपका मूल्यांकन करेगा।',
    timelineTitle: 'आपका चिकित्सा इतिहास',
    reviewTitle: 'कृपया अपनी जानकारी जाँचें',
    editBtn: '✏️ संपादित करें',
    submitBtn: '✅  सब कुछ सही है — जमा करें',
    processingTitle: 'आपका चिकित्सा इतिहास तैयार हो रहा है…',
    completedTitle: 'आपका चिकित्सा इतिहास तैयार है।',
    completedSubtitle: 'कृपया डॉक्टर का इंतज़ार करें।',
    sentToTeam: 'आपकी जानकारी स्वास्थ्य टीम को भेज दी गई है।',
    doctorTitle: 'MediKiosk – रोगी नैदानिक सारांश',
    aiDraft: '⚠️  AI-जनित मसौदा — चिकित्सक सत्यापन की प्रतीक्षा में',
    ayushTitle: 'आयुष / आयुर्वेदिक मूल्यांकन',
    prakritiQ: 'आपका शरीर प्रकार क्या है?',
    vata: 'वात (पतला, हल्का)',
    pitta: 'पित्त (मध्यम, गर्म)',
    kapha: 'कफ (भारी, मज़बूत)',
    notKnown: 'मुझे नहीं पता',
    helpOn: 'सहायता चालू',
    helpOff: 'सहायता',
  },
};

// ─── Helper Components ────────────────────────────────────────────────────────

function ProgressBar({ step, total }: { step: number; total: number }) {
  const pct = Math.round((step / total) * 100);
  return (
    <div className="w-full px-6 pt-4 pb-2">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-bold text-mk-muted uppercase tracking-wider">
          Medical History
        </span>
        <span className="text-sm font-bold text-mk-deep">
          {step} / {total}
        </span>
      </div>
      <div className="w-full h-3 bg-mk-gray rounded-full overflow-hidden">
        <div
          className="h-full bg-mk-blue rounded-full transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function TopBar({
  lang,
  helpMode,
  isSpeaking,
  onToggleHelp,
  onRepeat,
  onLangToggle,
}: {
  lang: Lang;
  helpMode: boolean;
  isSpeaking: boolean;
  onToggleHelp: () => void;
  onRepeat: () => void;
  onLangToggle: () => void;
}) {
  const t = T[lang];
  return (
    <div className="flex items-center justify-between px-4 py-2 border-b border-mk-gray bg-white/80 backdrop-blur sticky top-0 z-10">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-mk-blue rounded-lg flex items-center justify-center">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="#0d2a5a"/>
          </svg>
        </div>
        <span className="font-black text-mk-navy text-sm">MediKiosk</span>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onRepeat}
          className={`btn-tap flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold border-2 transition-all ${
            isSpeaking
              ? 'bg-mk-blue border-mk-blue text-mk-navy speaking-pulse'
              : 'bg-white border-mk-blue text-mk-navy hover:bg-mk-light'
          }`}
        >
          🔊 {t.repeatBtn.replace('🔊 ', '')}
        </button>
        <button
          onClick={onToggleHelp}
          className={`btn-tap flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold border-2 transition-all ${
            helpMode
              ? 'bg-mk-mint border-mk-success text-mk-success'
              : 'bg-white border-mk-gray text-mk-muted hover:bg-mk-light'
          }`}
        >
          {helpMode ? t.helpOn : t.helpOff}
        </button>
        <button
          onClick={onLangToggle}
          className="btn-tap px-3 py-1.5 rounded-full text-xs font-bold border-2 border-mk-gray bg-white text-mk-deep hover:bg-mk-light transition-all"
        >
          {lang === 'en' ? 'हिंदी' : 'English'}
        </button>
      </div>
    </div>
  );
}

function HelpPanel({ text }: { text: string }) {
  return (
    <div className="mx-4 mt-3 p-4 rounded-2xl bg-mk-mint border-2 border-emerald-200 flex gap-3 items-start screen-enter">
      <span className="text-2xl flex-shrink-0">💡</span>
      <p className="text-mk-text font-semibold text-base leading-relaxed">{text}</p>
    </div>
  );
}

function NavButtons({
  lang,
  onBack,
  onNext,
  showBack = true,
  nextLabel,
  nextDisabled = false,
  nextDanger = false,
}: {
  lang: Lang;
  onBack?: () => void;
  onNext?: () => void;
  showBack?: boolean;
  nextLabel?: string;
  nextDisabled?: boolean;
  nextDanger?: boolean;
}) {
  const t = T[lang];
  return (
    <div className="flex gap-3 px-4 py-4 border-t border-mk-gray bg-white mt-auto">
      {showBack && (
        <button
          onClick={onBack}
          className="btn-tap flex-1 py-4 rounded-2xl border-2 border-mk-gray bg-white text-mk-deep font-bold text-lg hover:bg-mk-light active:bg-mk-gray transition-all"
        >
          {t.back}
        </button>
      )}
      <button
        onClick={onNext}
        disabled={nextDisabled}
        className={`btn-tap flex-[2] py-4 rounded-2xl font-bold text-lg transition-all ${
          nextDanger
            ? 'bg-mk-danger text-white hover:opacity-90'
            : nextDisabled
            ? 'bg-mk-gray text-mk-muted cursor-not-allowed'
            : 'bg-mk-navy text-white hover:bg-mk-deep active:opacity-90'
        }`}
      >
        {nextLabel || t.next}
      </button>
    </div>
  );
}

function BigChoiceBtn({
  label,
  selected,
  onClick,
  icon,
  color,
}: {
  label: string;
  selected?: boolean;
  onClick: () => void;
  icon?: string;
  color?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`btn-tap w-full py-5 px-5 rounded-2xl border-3 flex items-center gap-4 text-left transition-all ${
        selected
          ? 'bg-blue-50 border-blue-500 text-blue-800'
          : 'bg-white border-mk-gray text-mk-text hover:border-mk-blue hover:bg-mk-light'
      }`}
      style={{ borderWidth: '2.5px' }}
    >
      {icon && <span className="text-3xl flex-shrink-0">{icon}</span>}
      {color && (
        <span
          className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-xl"
          style={{ background: color }}
        >
          {icon}
        </span>
      )}
      <span className="font-bold text-xl">{label}</span>
      {selected && <span className="ml-auto text-blue-500 text-2xl">✓</span>}
    </button>
  );
}

function YesNoButtons({
  lang,
  value,
  onChange,
  showNotSure = true,
}: {
  lang: Lang;
  value?: string;
  onChange: (v: string) => void;
  showNotSure?: boolean;
}) {
  const t = T[lang];
  const opts = [
    { v: 'yes', label: t.yes, icon: '✅', bg: 'bg-emerald-50 border-emerald-400 text-emerald-800', sel: 'bg-emerald-100 border-emerald-600 text-emerald-900' },
    { v: 'no', label: t.no, icon: '❌', bg: 'bg-red-50 border-red-300 text-red-800', sel: 'bg-red-100 border-red-500 text-red-900' },
    ...(showNotSure ? [{ v: 'not-sure', label: t.notSure, icon: '🤔', bg: 'bg-mk-light border-mk-gray text-mk-muted', sel: 'bg-mk-gray border-mk-muted text-mk-deep' }] : []),
  ];
  return (
    <div className="flex flex-col gap-3 px-4">
      {opts.map(o => (
        <button
          key={o.v}
          onClick={() => onChange(o.v)}
          className={`btn-tap w-full py-5 px-6 rounded-2xl border-2 flex items-center gap-4 font-bold text-2xl transition-all ${
            value === o.v ? o.sel : o.bg
          }`}
        >
          <span className="text-3xl">{o.icon}</span>
          {o.label}
          {value === o.v && <span className="ml-auto text-2xl">✓</span>}
        </button>
      ))}
    </div>
  );
}

// ─── Screens ──────────────────────────────────────────────────────────────────

function WelcomeScreen({
  lang,
  onStart,
  onLangToggle,
  onDoctorMode,
  onAyushMode,
}: {
  lang: Lang;
  onStart: () => void;
  onLangToggle: () => void;
  onDoctorMode: () => void;
  onAyushMode: () => void;
}) {
  const t = T[lang];
  return (
    <div className="min-h-full flex flex-col bg-mk-light screen-enter">
      <div className="flex items-center justify-between px-6 pt-6 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-mk-navy rounded-2xl flex items-center justify-center shadow-md">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="white"/>
            </svg>
          </div>
          <span className="font-black text-mk-navy text-xl">MediKiosk</span>
        </div>
        <button
          onClick={onLangToggle}
          className="btn-tap px-4 py-2 rounded-full border-2 border-mk-blue bg-white text-mk-navy font-bold hover:bg-mk-blue/20 transition-all"
        >
          {lang === 'en' ? '🇮🇳 हिंदी' : '🇬🇧 English'}
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8 gap-6">
        {/* Illustration */}
        <div className="w-56 h-56 bg-white rounded-full shadow-lg border-4 border-mk-blue flex items-center justify-center">
          <svg width="140" height="140" viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Doctor figure */}
            <circle cx="52" cy="36" r="18" fill="#DDE3EA" />
            <circle cx="52" cy="32" r="12" fill="#CFF7EA" />
            <rect x="36" y="54" width="32" height="36" rx="8" fill="#8EC5FF" />
            <rect x="30" y="58" width="12" height="28" rx="6" fill="#8EC5FF" />
            <rect x="58" y="58" width="12" height="28" rx="6" fill="#8EC5FF" />
            <rect x="42" y="90" width="8" height="20" rx="4" fill="#DDE3EA" />
            <rect x="54" y="90" width="8" height="20" rx="4" fill="#DDE3EA" />
            {/* Stethoscope */}
            <circle cx="52" cy="68" r="4" fill="white" />
            <path d="M52 72 C52 80 62 80 62 74" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <circle cx="62" cy="73" r="3" fill="white" />
            {/* AI orb */}
            <circle cx="98" cy="50" r="28" fill="#0d2a5a" opacity="0.9" />
            <circle cx="98" cy="50" r="22" fill="#1a3a6b" />
            <text x="98" y="45" textAnchor="middle" fill="#8EC5FF" fontSize="10" fontWeight="bold">AI</text>
            <text x="98" y="58" textAnchor="middle" fill="#CFF7EA" fontSize="7">मेडी</text>
            {/* Signal lines */}
            <path d="M76 50 L84 50" stroke="#8EC5FF" strokeWidth="2" strokeDasharray="2 2" />
            <path d="M112 42 L118 36" stroke="#CFF7EA" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M114 50 L122 50" stroke="#CFF7EA" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M112 58 L118 64" stroke="#CFF7EA" strokeWidth="1.5" strokeLinecap="round" />
            {/* Heart rate */}
            <path d="M20 115 L30 115 L35 105 L40 125 L45 110 L50 115 L60 115" stroke="#8EC5FF" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <div className="text-center space-y-2">
          <h1 className={`text-4xl font-black text-mk-navy leading-tight ${lang === 'hi' ? 'font-devanagari' : ''}`}>
            {t.welcomeTitle}
          </h1>
          <p className={`text-xl text-mk-muted font-semibold ${lang === 'hi' ? 'font-devanagari' : ''}`}>
            {t.welcomeSubtitle}
          </p>
        </div>

        {/* Government badge */}
        <div className="flex items-center gap-2 px-5 py-2 bg-white rounded-full border border-mk-gray shadow-sm">
          <span className="text-lg">🏥</span>
          <span className="text-sm font-bold text-mk-muted">Government of India — NHA</span>
          <span className="text-lg">🇮🇳</span>
        </div>
      </div>

      {/* Buttons */}
      <div className="px-6 pb-8 space-y-4">
        <button
          onClick={onStart}
          className="btn-tap w-full py-6 rounded-3xl bg-mk-navy text-white font-black text-2xl shadow-lg hover:bg-mk-deep active:scale-97 transition-all"
        >
          {t.start} →
        </button>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onDoctorMode}
            className="btn-tap py-4 rounded-2xl bg-white border-2 border-mk-blue text-mk-navy font-bold text-base hover:bg-mk-light transition-all flex items-center justify-center gap-2"
          >
            🩺 {t.doctorMode}
          </button>
          <button
            onClick={onAyushMode}
            className="btn-tap py-4 rounded-2xl bg-white border-2 border-mk-mint text-mk-navy font-bold text-base hover:bg-mk-mint/20 transition-all flex items-center justify-center gap-2"
          >
            🌿 {t.ayushMode}
          </button>
        </div>

        {/* Accessibility buttons */}
        <div className="flex items-center justify-center gap-6 pt-2">
          <button className="flex flex-col items-center gap-1 text-mk-muted hover:text-mk-navy transition-colors">
            <div className="w-10 h-10 rounded-full bg-mk-gray flex items-center justify-center text-xl">🔊</div>
            <span className="text-xs font-semibold">Audio</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-mk-muted hover:text-mk-navy transition-colors">
            <div className="w-10 h-10 rounded-full bg-mk-gray flex items-center justify-center text-xl">♿</div>
            <span className="text-xs font-semibold">Accessible</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-mk-muted hover:text-mk-navy transition-colors">
            <div className="w-10 h-10 rounded-full bg-mk-gray flex items-center justify-center text-xl">🆘</div>
            <span className="text-xs font-semibold">Help</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function ConsentScreen({
  lang,
  helpMode,
  isSpeaking,
  onToggleHelp,
  onRepeat,
  onLangToggle,
  onNext,
  onBack,
}: {
  lang: Lang;
  helpMode: boolean;
  isSpeaking: boolean;
  onToggleHelp: () => void;
  onRepeat: () => void;
  onLangToggle: () => void;
  onNext: (v: string) => void;
  onBack: () => void;
}) {
  const t = T[lang];
  return (
    <div className="min-h-full flex flex-col bg-mk-light screen-enter">
      <TopBar lang={lang} helpMode={helpMode} isSpeaking={isSpeaking} onToggleHelp={onToggleHelp} onRepeat={onRepeat} onLangToggle={onLangToggle} />
      {helpMode && (
        <HelpPanel text={lang === 'en'
          ? 'We will save your answers to create your medical file for the doctor. Your information is private and secure.'
          : 'हम आपके उत्तर सहेजेंगे ताकि डॉक्टर के लिए आपकी मेडिकल फ़ाइल बनाई जा सके। आपकी जानकारी निजी और सुरक्षित है।'}
        />
      )}

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8 gap-8">
        <div className="w-28 h-28 bg-white rounded-full shadow-md border-3 border-mk-blue flex items-center justify-center text-6xl">
          📋
        </div>
        <h2 className={`text-3xl font-black text-mk-navy text-center leading-snug max-w-md ${lang === 'hi' ? 'font-devanagari' : ''}`}>
          {t.consentQ}
        </h2>
        <button className="flex items-center gap-2 px-5 py-2 rounded-full bg-mk-blue/20 border border-mk-blue text-mk-navy font-bold text-base hover:bg-mk-blue/30 transition-all">
          {t.listenInfo}
        </button>
      </div>

      <div className="px-6 pb-8 space-y-4">
        <button
          onClick={() => onNext('yes')}
          className="btn-tap w-full py-6 rounded-3xl bg-mk-success text-white font-black text-2xl shadow flex items-center justify-center gap-3 hover:opacity-90 transition-all"
        >
          ✅ {lang === 'hi' ? t.consentYes.replace('✅  ', '') : t.consentYes.replace('✅  ', '')}
        </button>
        <button
          onClick={() => onNext('no')}
          className="btn-tap w-full py-5 rounded-3xl bg-white border-2 border-mk-danger text-mk-danger font-bold text-xl hover:bg-red-50 transition-all"
        >
          ❌ {lang === 'hi' ? t.consentNo.replace('❌  ', '') : t.consentNo.replace('❌  ', '')}
        </button>
        <button onClick={onBack} className="btn-tap w-full py-4 rounded-2xl text-mk-muted font-bold text-base hover:text-mk-deep transition-all">
          {t.back}
        </button>
      </div>
    </div>
  );
}

function PatientIdScreen({
  lang,
  helpMode,
  isSpeaking,
  onToggleHelp,
  onRepeat,
  onLangToggle,
  onNext,
  onBack,
}: {
  lang: Lang;
  helpMode: boolean;
  isSpeaking: boolean;
  onToggleHelp: () => void;
  onRepeat: () => void;
  onLangToggle: () => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const t = T[lang];
  return (
    <div className="min-h-full flex flex-col bg-mk-light screen-enter">
      <TopBar lang={lang} helpMode={helpMode} isSpeaking={isSpeaking} onToggleHelp={onToggleHelp} onRepeat={onRepeat} onLangToggle={onLangToggle} />
      {helpMode && <HelpPanel text={t.patientIdHelp} />}

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8 gap-6">
        {/* QR illustration */}
        <div className="w-48 h-48 bg-white rounded-3xl shadow-md border-2 border-mk-gray flex items-center justify-center">
          <svg width="120" height="120" viewBox="0 0 120 120">
            <rect x="10" y="10" width="40" height="40" rx="4" fill="none" stroke="#0d2a5a" strokeWidth="3" />
            <rect x="20" y="20" width="20" height="20" rx="2" fill="#0d2a5a" />
            <rect x="70" y="10" width="40" height="40" rx="4" fill="none" stroke="#0d2a5a" strokeWidth="3" />
            <rect x="80" y="20" width="20" height="20" rx="2" fill="#0d2a5a" />
            <rect x="10" y="70" width="40" height="40" rx="4" fill="none" stroke="#0d2a5a" strokeWidth="3" />
            <rect x="20" y="80" width="20" height="20" rx="2" fill="#0d2a5a" />
            <rect x="70" y="70" width="8" height="8" fill="#8EC5FF" />
            <rect x="82" y="70" width="8" height="8" fill="#8EC5FF" />
            <rect x="94" y="70" width="16" height="8" fill="#8EC5FF" />
            <rect x="70" y="82" width="16" height="8" fill="#8EC5FF" />
            <rect x="90" y="82" width="20" height="8" fill="#8EC5FF" />
            <rect x="70" y="94" width="8" height="16" fill="#8EC5FF" />
            <rect x="82" y="100" width="28" height="10" fill="#8EC5FF" />
            {/* ABHA logo hint */}
            <text x="60" y="64" textAnchor="middle" fill="#1a3a6b" fontSize="9" fontWeight="bold">ABHA</text>
          </svg>
        </div>

        <h2 className={`text-3xl font-black text-mk-navy text-center ${lang === 'hi' ? 'font-devanagari' : ''}`}>
          {t.patientIdQ}
        </h2>
      </div>

      <div className="px-6 pb-8 space-y-4">
        <button className="btn-tap w-full py-6 rounded-2xl bg-mk-navy text-white font-bold text-xl flex items-center justify-center gap-3 hover:bg-mk-deep transition-all">
          <span className="text-2xl">📷</span>
          {lang === 'en' ? 'Scan QR / ABHA Card' : 'QR / ABHA कार्ड स्कैन करें'}
        </button>
        <button
          onClick={onNext}
          className="btn-tap w-full py-5 rounded-2xl bg-white border-2 border-mk-blue text-mk-navy font-bold text-xl hover:bg-mk-light transition-all"
        >
          {t.noAbha}
        </button>
        <button
          onClick={onNext}
          className="btn-tap w-full py-5 rounded-2xl bg-mk-mint border-2 border-emerald-200 text-mk-success font-bold text-xl hover:opacity-90 transition-all"
        >
          {t.newPatient}
        </button>
        <button onClick={onBack} className="btn-tap w-full py-3 rounded-xl text-mk-muted font-bold text-base hover:text-mk-deep transition-all">
          {t.back}
        </button>
      </div>
    </div>
  );
}

function MainComplaintScreen({
  lang,
  helpMode,
  isSpeaking,
  onToggleHelp,
  onRepeat,
  onLangToggle,
  value,
  onChange,
  onNext,
  onBack,
  step,
  total,
}: {
  lang: Lang;
  helpMode: boolean;
  isSpeaking: boolean;
  onToggleHelp: () => void;
  onRepeat: () => void;
  onLangToggle: () => void;
  value?: string;
  onChange: (v: string) => void;
  onNext: () => void;
  onBack: () => void;
  step: number;
  total: number;
}) {
  const t = T[lang];
  const complaints = [
    { v: 'chest-pain', en: 'Chest Pain', hi: 'छाती में दर्द', icon: '❤️' },
    { v: 'headache', en: 'Headache', hi: 'सिरदर्द', icon: '🤕' },
    { v: 'fever', en: 'Fever', hi: 'बुखार', icon: '🌡️' },
    { v: 'breathing', en: 'Breathing Problem', hi: 'साँस की समस्या', icon: '🫁' },
    { v: 'stomach', en: 'Stomach Problem', hi: 'पेट की समस्या', icon: '🤢' },
    { v: 'pain', en: 'Pain / Ache', hi: 'दर्द', icon: '🦴' },
    { v: 'other', en: 'Something Else', hi: 'कुछ और', icon: '➕' },
  ];
  return (
    <div className="min-h-full flex flex-col bg-mk-light screen-enter">
      <TopBar lang={lang} helpMode={helpMode} isSpeaking={isSpeaking} onToggleHelp={onToggleHelp} onRepeat={onRepeat} onLangToggle={onLangToggle} />
      <ProgressBar step={step} total={total} />
      {helpMode && <HelpPanel text={t.complaintHelp} />}

      <div className="flex-1 overflow-y-auto px-4 py-4">
        <h2 className={`text-3xl font-black text-mk-navy text-center mb-6 px-2 ${lang === 'hi' ? 'font-devanagari' : ''}`}>
          {t.complaintQ}
        </h2>

        {/* Microphone button */}
        <div className="flex justify-center mb-6">
          <button className={`w-24 h-24 rounded-full flex flex-col items-center justify-center gap-1 border-4 transition-all ${
            isSpeaking ? 'bg-mk-blue border-mk-navy speaking-pulse' : 'bg-white border-mk-blue hover:bg-mk-light'
          }`}>
            <span className="text-4xl">🎙️</span>
            <span className="text-xs font-bold text-mk-navy">{lang === 'en' ? 'Speak' : 'बोलें'}</span>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          {complaints.map(c => (
            <button
              key={c.v}
              onClick={() => onChange(c.v)}
              className={`btn-tap py-5 px-3 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${
                value === c.v
                  ? 'bg-blue-50 border-blue-500'
                  : 'bg-white border-mk-gray hover:border-mk-blue hover:bg-mk-light'
              }`}
            >
              <span className="text-4xl">{c.icon}</span>
              <span className={`font-bold text-base text-center leading-tight ${value === c.v ? 'text-blue-800' : 'text-mk-text'} ${lang === 'hi' ? 'font-devanagari' : ''}`}>
                {lang === 'hi' ? c.hi : c.en}
              </span>
            </button>
          ))}
        </div>
      </div>

      <NavButtons lang={lang} onBack={onBack} onNext={onNext} nextDisabled={!value} />
    </div>
  );
}

function DurationScreen({
  lang, helpMode, isSpeaking, onToggleHelp, onRepeat, onLangToggle,
  value, onChange, onNext, onBack, step, total,
}: {
  lang: Lang; helpMode: boolean; isSpeaking: boolean;
  onToggleHelp: () => void; onRepeat: () => void; onLangToggle: () => void;
  value?: string; onChange: (v: string) => void; onNext: () => void; onBack: () => void;
  step: number; total: number;
}) {
  const t = T[lang];
  const opts = [
    { v: 'today', en: t.today, hi: t.today, icon: '🕐' },
    { v: '2-3-days', en: t.twoDays, hi: t.twoDays, icon: '📅' },
    { v: 'less-week', en: t.lessThanWeek, hi: t.lessThanWeek, icon: '🗓️' },
    { v: '1-4-weeks', en: t.oneToFourWeeks, hi: t.oneToFourWeeks, icon: '📆' },
    { v: 'more-month', en: t.moreThanMonth, hi: t.moreThanMonth, icon: '⏳' },
    { v: 'unknown', en: t.dontKnow, hi: t.dontKnow, icon: '🤷' },
  ];
  return (
    <div className="min-h-full flex flex-col bg-mk-light screen-enter">
      <TopBar lang={lang} helpMode={helpMode} isSpeaking={isSpeaking} onToggleHelp={onToggleHelp} onRepeat={onRepeat} onLangToggle={onLangToggle} />
      <ProgressBar step={step} total={total} />
      {helpMode && <HelpPanel text={t.durationHelp} />}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="flex justify-center mb-4">
          <span className="text-7xl">🗓️</span>
        </div>
        <h2 className={`text-3xl font-black text-mk-navy text-center mb-6 ${lang === 'hi' ? 'font-devanagari' : ''}`}>{t.durationQ}</h2>
        <div className="flex flex-col gap-3">
          {opts.map(o => (
            <BigChoiceBtn key={o.v} label={o.en} selected={value === o.v} onClick={() => onChange(o.v)} icon={o.icon} />
          ))}
        </div>
      </div>
      <NavButtons lang={lang} onBack={onBack} onNext={onNext} nextDisabled={!value} />
    </div>
  );
}

function SeverityScreen({
  lang, helpMode, isSpeaking, onToggleHelp, onRepeat, onLangToggle,
  value, onChange, onNext, onBack, step, total,
}: {
  lang: Lang; helpMode: boolean; isSpeaking: boolean;
  onToggleHelp: () => void; onRepeat: () => void; onLangToggle: () => void;
  value?: string; onChange: (v: string) => void; onNext: () => void; onBack: () => void;
  step: number; total: number;
}) {
  const t = T[lang];
  const opts = [
    { v: 'mild', emoji: '🙂', label: t.mild, color: '#CFF7EA', textColor: '#047857', border: '#a7f3d0' },
    { v: 'moderate', emoji: '😐', label: t.moderate, color: '#FEF9C3', textColor: '#854d0e', border: '#fde68a' },
    { v: 'severe', emoji: '😣', label: t.severe, color: '#FEE2E2', textColor: '#991b1b', border: '#fca5a5' },
    { v: 'very-severe', emoji: '🚨', label: t.verySevere, color: '#DC2626', textColor: '#ffffff', border: '#b91c1c' },
  ];
  return (
    <div className="min-h-full flex flex-col bg-mk-light screen-enter">
      <TopBar lang={lang} helpMode={helpMode} isSpeaking={isSpeaking} onToggleHelp={onToggleHelp} onRepeat={onRepeat} onLangToggle={onLangToggle} />
      <ProgressBar step={step} total={total} />
      {helpMode && <HelpPanel text={t.severityHelp} />}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <h2 className={`text-3xl font-black text-mk-navy text-center mb-8 ${lang === 'hi' ? 'font-devanagari' : ''}`}>{t.severityQ}</h2>
        <div className="flex flex-col gap-4">
          {opts.map(o => (
            <button
              key={o.v}
              onClick={() => onChange(o.v)}
              className="btn-tap w-full py-6 px-6 rounded-3xl flex items-center gap-5 transition-all"
              style={{
                background: value === o.v ? o.color : 'white',
                borderWidth: '2.5px',
                borderStyle: 'solid',
                borderColor: value === o.v ? o.border : '#DDE3EA',
              }}
            >
              <span className="text-5xl">{o.emoji}</span>
              <span className={`font-black text-2xl ${lang === 'hi' ? 'font-devanagari' : ''}`} style={{ color: value === o.v ? o.textColor : '#1a2744' }}>
                {o.label}
              </span>
              {value === o.v && <span className="ml-auto text-2xl" style={{ color: o.textColor }}>✓</span>}
            </button>
          ))}
        </div>
        {value === 'very-severe' && (
          <div className="mt-4 p-4 rounded-2xl bg-red-50 border-2 border-red-300 flex gap-3 items-center">
            <span className="text-2xl">⚠️</span>
            <p className="text-red-700 font-bold text-base">
              {lang === 'en' ? 'You will be directed to an emergency alert screen.' : 'आपको आपातकालीन अलर्ट स्क्रीन पर ले जाया जाएगा।'}
            </p>
          </div>
        )}
      </div>
      <NavButtons lang={lang} onBack={onBack} onNext={onNext} nextDisabled={!value} nextDanger={value === 'very-severe'} />
    </div>
  );
}

function LocationScreen({
  lang, helpMode, isSpeaking, onToggleHelp, onRepeat, onLangToggle,
  value, onChange, onNext, onBack, step, total,
}: {
  lang: Lang; helpMode: boolean; isSpeaking: boolean;
  onToggleHelp: () => void; onRepeat: () => void; onLangToggle: () => void;
  value: string[]; onChange: (v: string[]) => void; onNext: () => void; onBack: () => void;
  step: number; total: number;
}) {
  const t = T[lang];
  const locations = [
    { v: 'head', en: t.head, hi: t.head, icon: '🧠' },
    { v: 'chest', en: t.chest, hi: t.chest, icon: '🫀' },
    { v: 'stomach', en: t.stomach, hi: t.stomach, icon: '🤢' },
    { v: 'back', en: t.backBody, hi: t.backBody, icon: '🦴' },
    { v: 'arm', en: t.arm, hi: t.arm, icon: '💪' },
    { v: 'leg', en: t.leg, hi: t.leg, icon: '🦵' },
    { v: 'whole-body', en: t.wholeBody, hi: t.wholeBody, icon: '🧍' },
    { v: 'other', en: t.other, hi: t.other, icon: '➕' },
  ];
  const toggle = (v: string) => {
    if (v === 'whole-body') { onChange(['whole-body']); return; }
    const cur = value.filter(x => x !== 'whole-body');
    onChange(cur.includes(v) ? cur.filter(x => x !== v) : [...cur, v]);
  };
  return (
    <div className="min-h-full flex flex-col bg-mk-light screen-enter">
      <TopBar lang={lang} helpMode={helpMode} isSpeaking={isSpeaking} onToggleHelp={onToggleHelp} onRepeat={onRepeat} onLangToggle={onLangToggle} />
      <ProgressBar step={step} total={total} />
      {helpMode && <HelpPanel text={t.locationHelp} />}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <h2 className={`text-3xl font-black text-mk-navy text-center mb-2 ${lang === 'hi' ? 'font-devanagari' : ''}`}>{t.locationQ}</h2>
        <p className="text-center text-mk-muted font-semibold mb-5">
          {lang === 'en' ? 'Tap all that apply' : 'सभी लागू पर टैप करें'}
        </p>

        {/* Body SVG */}
        <div className="flex justify-center mb-6">
          <svg width="120" height="220" viewBox="0 0 120 220">
            <circle cx="60" cy="22" r="18" fill={value.includes('head') ? '#8EC5FF' : '#DDE3EA'} stroke="#0d2a5a" strokeWidth="1.5" onClick={() => toggle('head')} className="cursor-pointer" />
            <rect x="38" y="44" width="44" height="60" rx="12" fill={value.includes('chest') ? '#8EC5FF' : '#DDE3EA'} stroke="#0d2a5a" strokeWidth="1.5" onClick={() => toggle('chest')} className="cursor-pointer" />
            <rect x="42" y="108" width="36" height="46" rx="8" fill={value.includes('stomach') ? '#8EC5FF' : '#DDE3EA'} stroke="#0d2a5a" strokeWidth="1.5" onClick={() => toggle('stomach')} className="cursor-pointer" />
            <rect x="18" y="48" width="20" height="50" rx="10" fill={value.includes('arm') ? '#8EC5FF' : '#DDE3EA'} stroke="#0d2a5a" strokeWidth="1.5" onClick={() => toggle('arm')} className="cursor-pointer" />
            <rect x="82" y="48" width="20" height="50" rx="10" fill={value.includes('arm') ? '#8EC5FF' : '#DDE3EA'} stroke="#0d2a5a" strokeWidth="1.5" onClick={() => toggle('arm')} className="cursor-pointer" />
            <rect x="44" y="156" width="15" height="58" rx="8" fill={value.includes('leg') ? '#8EC5FF' : '#DDE3EA'} stroke="#0d2a5a" strokeWidth="1.5" onClick={() => toggle('leg')} className="cursor-pointer" />
            <rect x="61" y="156" width="15" height="58" rx="8" fill={value.includes('leg') ? '#8EC5FF' : '#DDE3EA'} stroke="#0d2a5a" strokeWidth="1.5" onClick={() => toggle('leg')} className="cursor-pointer" />
            <rect x="46" y="66" width="28" height="2" fill="#0d2a5a" opacity="0.3" />
            <text x="60" y="76" textAnchor="middle" fill="#0d2a5a" fontSize="8" opacity="0.6">back</text>
          </svg>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {locations.map(l => (
            <button
              key={l.v}
              onClick={() => toggle(l.v)}
              className={`btn-tap py-4 px-3 rounded-2xl border-2 flex items-center gap-3 transition-all ${
                value.includes(l.v)
                  ? 'bg-blue-50 border-blue-500'
                  : 'bg-white border-mk-gray hover:border-mk-blue'
              }`}
            >
              <span className="text-3xl">{l.icon}</span>
              <span className={`font-bold text-lg ${value.includes(l.v) ? 'text-blue-800' : 'text-mk-text'} ${lang === 'hi' ? 'font-devanagari' : ''}`}>
                {lang === 'hi' ? l.hi : l.en}
              </span>
              {value.includes(l.v) && <span className="ml-auto text-blue-500">✓</span>}
            </button>
          ))}
        </div>
      </div>
      <NavButtons lang={lang} onBack={onBack} onNext={onNext} nextDisabled={value.length === 0} />
    </div>
  );
}

function SimpleYesNoScreen({
  lang, helpMode, isSpeaking, onToggleHelp, onRepeat, onLangToggle,
  question, helpText, icon, value, onChange, onNext, onBack, step, total,
  extraContent,
}: {
  lang: Lang; helpMode: boolean; isSpeaking: boolean;
  onToggleHelp: () => void; onRepeat: () => void; onLangToggle: () => void;
  question: string; helpText: string; icon: string;
  value?: string; onChange: (v: string) => void; onNext: () => void; onBack: () => void;
  step: number; total: number;
  extraContent?: React.ReactNode;
}) {
  return (
    <div className="min-h-full flex flex-col bg-mk-light screen-enter">
      <TopBar lang={lang} helpMode={helpMode} isSpeaking={isSpeaking} onToggleHelp={onToggleHelp} onRepeat={onRepeat} onLangToggle={onLangToggle} />
      <ProgressBar step={step} total={total} />
      {helpMode && <HelpPanel text={helpText} />}
      <div className="flex-1 flex flex-col px-4 py-6 gap-6">
        <div className="flex justify-center">
          <span className="text-7xl">{icon}</span>
        </div>
        <h2 className={`text-3xl font-black text-mk-navy text-center ${lang === 'hi' ? 'font-devanagari' : ''}`}>{question}</h2>
        <YesNoButtons lang={lang} value={value} onChange={onChange} />
        {extraContent}
      </div>
      <NavButtons lang={lang} onBack={onBack} onNext={onNext} nextDisabled={!value} />
    </div>
  );
}

function MedicalConditionsScreen({
  lang, helpMode, isSpeaking, onToggleHelp, onRepeat, onLangToggle,
  value, onChange, onNext, onBack, step, total,
}: {
  lang: Lang; helpMode: boolean; isSpeaking: boolean;
  onToggleHelp: () => void; onRepeat: () => void; onLangToggle: () => void;
  value: string[]; onChange: (v: string[]) => void; onNext: () => void; onBack: () => void;
  step: number; total: number;
}) {
  const t = T[lang];
  const conditions = [
    { v: 'diabetes', en: t.diabetes, hi: t.diabetes, icon: '🩸' },
    { v: 'highbp', en: t.highBP, hi: t.highBP, icon: '💉' },
    { v: 'heart', en: t.heartDisease, hi: t.heartDisease, icon: '❤️' },
    { v: 'asthma', en: t.asthma, hi: t.asthma, icon: '🫁' },
    { v: 'kidney', en: t.kidneyDisease, hi: t.kidneyDisease, icon: '🫘' },
    { v: 'thyroid', en: t.thyroid, hi: t.thyroid, icon: '🦋' },
    { v: 'none', en: t.none, hi: t.none, icon: '✅' },
    { v: 'other', en: t.other, hi: t.other, icon: '➕' },
  ];
  const toggle = (v: string) => {
    if (v === 'none') { onChange(['none']); return; }
    const cur = value.filter(x => x !== 'none');
    onChange(cur.includes(v) ? cur.filter(x => x !== v) : [...cur, v]);
  };
  return (
    <div className="min-h-full flex flex-col bg-mk-light screen-enter">
      <TopBar lang={lang} helpMode={helpMode} isSpeaking={isSpeaking} onToggleHelp={onToggleHelp} onRepeat={onRepeat} onLangToggle={onLangToggle} />
      <ProgressBar step={step} total={total} />
      {helpMode && <HelpPanel text={t.conditionsHelp} />}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <h2 className={`text-3xl font-black text-mk-navy text-center mb-2 ${lang === 'hi' ? 'font-devanagari' : ''}`}>{t.conditionsQ}</h2>
        <p className="text-center text-mk-muted font-semibold mb-5">{lang === 'en' ? 'Select all that apply' : 'सभी लागू चुनें'}</p>
        <div className="grid grid-cols-2 gap-3">
          {conditions.map(c => (
            <button
              key={c.v}
              onClick={() => toggle(c.v)}
              className={`btn-tap py-5 px-3 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${
                value.includes(c.v) ? 'bg-blue-50 border-blue-500' : 'bg-white border-mk-gray hover:border-mk-blue'
              }`}
            >
              <span className="text-4xl">{c.icon}</span>
              <span className={`font-bold text-base text-center ${value.includes(c.v) ? 'text-blue-800' : 'text-mk-text'} ${lang === 'hi' ? 'font-devanagari' : ''}`}>
                {lang === 'hi' ? c.hi : c.en}
              </span>
              {value.includes(c.v) && <span className="text-blue-500 text-sm">✓</span>}
            </button>
          ))}
        </div>
      </div>
      <NavButtons lang={lang} onBack={onBack} onNext={onNext} nextDisabled={value.length === 0} />
    </div>
  );
}

function ActivityScreen({
  lang, helpMode, isSpeaking, onToggleHelp, onRepeat, onLangToggle,
  value, onChange, onNext, onBack, step, total,
}: {
  lang: Lang; helpMode: boolean; isSpeaking: boolean;
  onToggleHelp: () => void; onRepeat: () => void; onLangToggle: () => void;
  value?: string; onChange: (v: string) => void; onNext: () => void; onBack: () => void;
  step: number; total: number;
}) {
  const t = T[lang];
  const opts = [
    { v: 'very-active', label: t.veryActive, icon: '🏃', desc: lang === 'en' ? 'Walk/work 2+ hours daily' : 'रोज़ 2+ घंटे चलना/काम करना' },
    { v: 'moderate', label: t.moderatelyActive, icon: '🚶', desc: lang === 'en' ? 'Walk 30–60 mins daily' : 'रोज़ 30–60 मिनट चलना' },
    { v: 'light', label: t.lightActivity, icon: '🧘', desc: lang === 'en' ? 'Light activity, short walks' : 'हल्की गतिविधि, छोटी सैर' },
    { v: 'sedentary', label: t.sedentary, icon: '🪑', desc: lang === 'en' ? 'Mostly sitting or lying' : 'ज़्यादातर बैठना या लेटना' },
  ];
  return (
    <div className="min-h-full flex flex-col bg-mk-light screen-enter">
      <TopBar lang={lang} helpMode={helpMode} isSpeaking={isSpeaking} onToggleHelp={onToggleHelp} onRepeat={onRepeat} onLangToggle={onLangToggle} />
      <ProgressBar step={step} total={total} />
      {helpMode && <HelpPanel text={t.activityHelp} />}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <h2 className={`text-3xl font-black text-mk-navy text-center mb-6 ${lang === 'hi' ? 'font-devanagari' : ''}`}>{t.activityQ}</h2>
        <div className="flex flex-col gap-3">
          {opts.map(o => (
            <button
              key={o.v}
              onClick={() => onChange(o.v)}
              className={`btn-tap w-full py-5 px-5 rounded-2xl border-2 flex items-center gap-4 transition-all ${
                value === o.v ? 'bg-blue-50 border-blue-500' : 'bg-white border-mk-gray hover:border-mk-blue'
              }`}
            >
              <span className="text-4xl">{o.icon}</span>
              <div className="flex-1 text-left">
                <div className={`font-bold text-xl ${value === o.v ? 'text-blue-800' : 'text-mk-text'} ${lang === 'hi' ? 'font-devanagari' : ''}`}>{o.label}</div>
                <div className={`text-sm text-mk-muted font-semibold ${lang === 'hi' ? 'font-devanagari' : ''}`}>{o.desc}</div>
              </div>
              {value === o.v && <span className="text-blue-500 text-2xl">✓</span>}
            </button>
          ))}
        </div>
      </div>
      <NavButtons lang={lang} onBack={onBack} onNext={onNext} nextDisabled={!value} />
    </div>
  );
}

function DocumentsScreen({
  lang, helpMode, isSpeaking, onToggleHelp, onRepeat, onLangToggle,
  onChange, onNext, onBack, step, total,
}: {
  lang: Lang; helpMode: boolean; isSpeaking: boolean;
  onToggleHelp: () => void; onRepeat: () => void; onLangToggle: () => void;
  onChange: (v: string) => void; onNext: (v: string) => void; onBack: () => void;
  step: number; total: number;
}) {
  const t = T[lang];
  const docTypes = ['Prescription', 'Blood Test', 'Discharge Summary', 'Medical Report', 'Imaging Report'];
  return (
    <div className="min-h-full flex flex-col bg-mk-light screen-enter">
      <TopBar lang={lang} helpMode={helpMode} isSpeaking={isSpeaking} onToggleHelp={onToggleHelp} onRepeat={onRepeat} onLangToggle={onLangToggle} />
      <ProgressBar step={step} total={total} />
      {helpMode && <HelpPanel text={t.documentsHelp} />}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="flex justify-center mb-4">
          <div className="w-32 h-32 bg-white rounded-3xl shadow-md border-2 border-mk-gray flex items-center justify-center text-6xl">📄</div>
        </div>
        <h2 className={`text-3xl font-black text-mk-navy text-center mb-6 ${lang === 'hi' ? 'font-devanagari' : ''}`}>{t.documentsQ}</h2>
        <div className="flex flex-wrap gap-2 justify-center mb-6">
          {docTypes.map(d => (
            <span key={d} className="px-3 py-1.5 rounded-full bg-mk-blue/20 border border-mk-blue text-mk-navy font-bold text-sm">{d}</span>
          ))}
        </div>
        <div className="flex flex-col gap-4">
          <button
            onClick={() => { onChange('yes'); onNext('yes'); }}
            className="btn-tap w-full py-6 rounded-2xl bg-mk-navy text-white font-bold text-xl flex items-center justify-center gap-3 hover:bg-mk-deep transition-all"
          >
            📷 {lang === 'en' ? 'Scan Document' : 'दस्तावेज़ स्कैन करें'}
          </button>
          <button
            onClick={() => { onChange('yes'); onNext('yes'); }}
            className="btn-tap w-full py-6 rounded-2xl bg-white border-2 border-mk-blue text-mk-navy font-bold text-xl flex items-center justify-center gap-3 hover:bg-mk-light transition-all"
          >
            📁 {lang === 'en' ? 'Upload Document' : 'दस्तावेज़ अपलोड करें'}
          </button>
          <button
            onClick={() => { onChange('no'); onNext('no'); }}
            className="btn-tap w-full py-5 rounded-2xl bg-mk-gray text-mk-muted font-bold text-lg flex items-center justify-center gap-3 hover:bg-mk-gray/70 transition-all"
          >
            ⏭️ {lang === 'en' ? 'I don\'t have reports' : 'मेरे पास रिपोर्ट नहीं है'}
          </button>
        </div>
      </div>
      <div className="px-4 pb-4">
        <button onClick={onBack} className="btn-tap w-full py-4 rounded-xl text-mk-muted font-bold text-base hover:text-mk-deep transition-all">
          {t.back}
        </button>
      </div>
    </div>
  );
}

function OcrProcessingScreen({
  lang,
  onDone,
}: {
  lang: Lang;
  onDone: () => void;
}) {
  const t = T[lang];
  const steps = [t.docDetected, t.textExtracted, t.medsIdentified, t.resultsIdentified, t.dateIdentified];
  const [done, setDone] = useState(0);

  useEffect(() => {
    if (done >= steps.length) { setTimeout(onDone, 800); return; }
    const timer = setTimeout(() => setDone(d => d + 1), 700);
    return () => clearTimeout(timer);
  }, [done]);

  return (
    <div className="min-h-full flex flex-col items-center justify-center bg-mk-light px-6 py-12 gap-8 screen-enter">
      <div className="w-32 h-32 bg-white rounded-3xl shadow-md border-2 border-mk-blue flex items-center justify-center text-6xl">
        📄
      </div>
      <h2 className={`text-3xl font-black text-mk-navy text-center ${lang === 'hi' ? 'font-devanagari' : ''}`}>{t.ocrTitle}</h2>
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-md border border-mk-gray p-6 flex flex-col gap-4">
        {steps.map((s, i) => (
          <div key={s} className={`flex items-center gap-3 transition-all duration-500 ${i < done ? 'opacity-100' : 'opacity-30'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-black transition-all ${i < done ? 'bg-mk-success text-white step-check' : 'bg-mk-gray text-mk-muted'}`}>
              {i < done ? '✓' : i + 1}
            </div>
            <span className={`font-semibold text-lg ${lang === 'hi' ? 'font-devanagari' : ''}`} style={{ color: i < done ? '#047857' : '#4a5a7a' }}>{s}</span>
          </div>
        ))}
      </div>
      <div className="w-48 h-2 bg-mk-gray rounded-full overflow-hidden">
        <div className="h-full bg-mk-blue rounded-full transition-all duration-500" style={{ width: `${(done / steps.length) * 100}%` }} />
      </div>
    </div>
  );
}

function DocumentResultsScreen({
  lang,
  onNext,
  onBack,
}: {
  lang: Lang;
  onNext: () => void;
  onBack: () => void;
}) {
  const t = T[lang];
  const results = [
    { label: lang === 'en' ? 'Diagnosis' : 'निदान', value: 'Hypertension', icon: '🩺', flag: false },
    { label: lang === 'en' ? 'Medicine' : 'दवाई', value: 'Amlodipine 5 mg', icon: '💊', flag: false },
    { label: lang === 'en' ? 'Blood Pressure' : 'रक्तचाप', value: '150/95', icon: '📊', flag: true },
    { label: lang === 'en' ? 'Date' : 'तारीख', value: '12 August 2026', icon: '📅', flag: false },
  ];
  return (
    <div className="min-h-full flex flex-col bg-mk-light screen-enter">
      <div className="px-4 py-4 border-b border-mk-gray bg-white">
        <h2 className={`text-2xl font-black text-mk-navy text-center ${lang === 'hi' ? 'font-devanagari' : ''}`}>{t.docResultTitle}</h2>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-4">
        <div className="w-full h-40 bg-mk-gray rounded-2xl flex items-center justify-center text-4xl">
          📄 <span className="text-mk-muted font-semibold text-base ml-2">{lang === 'en' ? 'Document Preview' : 'दस्तावेज़ पूर्वावलोकन'}</span>
        </div>
        {results.map(r => (
          <div key={r.label} className={`bg-white rounded-2xl border-2 p-5 flex items-center gap-4 ${r.flag ? 'border-amber-400' : 'border-mk-gray'}`}>
            <span className="text-4xl">{r.icon}</span>
            <div className="flex-1">
              <div className="text-mk-muted font-semibold text-sm uppercase tracking-wider">{r.label}</div>
              <div className="font-black text-xl text-mk-text">{r.value}</div>
            </div>
            {r.flag && <span className="text-2xl">⚠️</span>}
          </div>
        ))}
        <p className="text-center text-mk-muted font-semibold text-sm px-4">
          {lang === 'en' ? 'Tap Edit on any card to correct information.' : 'जानकारी सुधारने के लिए किसी भी कार्ड पर संपादित टैप करें।'}
        </p>
      </div>
      <div className="px-4 pb-6 space-y-3">
        <button onClick={onNext} className="btn-tap w-full py-5 rounded-2xl bg-mk-success text-white font-bold text-xl hover:opacity-90 transition-all">
          {t.checkInfo}
        </button>
        <button className="btn-tap w-full py-4 rounded-2xl bg-white border-2 border-mk-blue text-mk-navy font-bold text-lg hover:bg-mk-light transition-all">
          {t.scanAnother}
        </button>
      </div>
    </div>
  );
}

function RedFlagScreen({
  lang,
  onCallStaff,
  onContinue,
}: {
  lang: Lang;
  onCallStaff: () => void;
  onContinue: () => void;
}) {
  const t = T[lang];
  return (
    <div className="min-h-full flex flex-col bg-red-50 screen-enter">
      <div className="bg-mk-danger px-6 py-8 flex flex-col items-center gap-4">
        <span className="text-7xl animate-bounce">🚨</span>
        <h1 className={`text-3xl font-black text-white text-center ${lang === 'hi' ? 'font-devanagari' : ''}`}>{t.redFlagTitle}</h1>
      </div>
      <div className="flex-1 flex flex-col px-6 py-8 gap-6">
        <p className={`text-2xl font-bold text-mk-danger text-center leading-relaxed ${lang === 'hi' ? 'font-devanagari' : ''}`}>{t.redFlagMsg}</p>
        <div className="bg-red-100 border-2 border-mk-danger rounded-2xl p-5">
          <p className={`text-mk-danger font-bold text-lg text-center ${lang === 'hi' ? 'font-devanagari' : ''}`}>{t.notDiagnosis}</p>
        </div>
      </div>
      <div className="px-6 pb-8 space-y-4">
        <button
          onClick={onCallStaff}
          className="btn-tap w-full py-7 rounded-3xl bg-mk-danger text-white font-black text-2xl shadow-lg hover:opacity-90 transition-all animate-pulse"
        >
          {t.callStaff}
        </button>
        <button
          onClick={onContinue}
          className="btn-tap w-full py-5 rounded-2xl bg-white border-2 border-mk-danger text-mk-danger font-bold text-lg hover:bg-red-50 transition-all"
        >
          {t.continueIfSafe}
        </button>
      </div>
    </div>
  );
}

function MedicalTimelineScreen({
  lang,
  onNext,
  onBack,
}: {
  lang: Lang;
  onNext: () => void;
  onBack: () => void;
}) {
  const t = T[lang];
  const events = [
    { year: '2024', label: lang === 'en' ? 'Previous Diagnosis' : 'पिछला निदान', sublabel: 'Hypertension', icon: '🩺', color: '#DDE3EA' },
    { year: '2025', label: lang === 'en' ? 'Prescription' : 'पर्चा', sublabel: 'Amlodipine 5mg', icon: '💊', color: '#CFF7EA' },
    { year: '2026', label: lang === 'en' ? 'Blood Test' : 'रक्त परीक्षण', sublabel: 'BP 150/95 ⚠️', icon: '🩸', color: '#FEF9C3' },
    { year: lang === 'en' ? 'Today' : 'आज', label: lang === 'en' ? 'Current Symptoms' : 'वर्तमान लक्षण', sublabel: lang === 'en' ? 'Chest pain, 2 days' : 'छाती में दर्द, 2 दिन', icon: '📋', color: '#8EC5FF' },
  ];
  return (
    <div className="min-h-full flex flex-col bg-mk-light screen-enter">
      <div className="px-4 py-4 border-b border-mk-gray bg-white">
        <h2 className={`text-2xl font-black text-mk-navy text-center ${lang === 'hi' ? 'font-devanagari' : ''}`}>{t.timelineTitle}</h2>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="relative">
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-mk-gray" />
          <div className="flex flex-col gap-6">
            {events.map((e, i) => (
              <div key={i} className="flex gap-5 items-start">
                <div className="flex flex-col items-center z-10">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-sm" style={{ background: e.color, borderWidth: '2px', borderStyle: 'solid', borderColor: '#DDE3EA' }}>
                    {e.icon}
                  </div>
                </div>
                <div className="flex-1 bg-white rounded-2xl border border-mk-gray p-4 shadow-sm">
                  <div className="font-black text-mk-blue text-sm uppercase tracking-wider">{e.year}</div>
                  <div className={`font-bold text-xl text-mk-text ${lang === 'hi' ? 'font-devanagari' : ''}`}>{e.label}</div>
                  <div className={`text-mk-muted font-semibold ${lang === 'hi' ? 'font-devanagari' : ''}`}>{e.sublabel}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <NavButtons lang={lang} onBack={onBack} onNext={onNext} />
    </div>
  );
}

function FinalReviewScreen({
  lang,
  answers,
  onNext,
  onBack,
  onEdit,
}: {
  lang: Lang;
  answers: Answers;
  onNext: () => void;
  onBack: () => void;
  onEdit: (screen: Screen) => void;
}) {
  const t = T[lang];
  const complaintMap: Record<string, string> = {
    'chest-pain': '❤️ Chest Pain',
    headache: '🤕 Headache',
    fever: '🌡️ Fever',
    breathing: '🫁 Breathing Problem',
    stomach: '🤢 Stomach Problem',
    pain: '🦴 Pain',
    other: '➕ Other',
  };
  const rows = [
    { label: lang === 'en' ? 'Main Problem' : 'मुख्य समस्या', value: answers.complaint ? complaintMap[answers.complaint] || answers.complaint : '—', screen: 'main-complaint' as Screen },
    { label: lang === 'en' ? 'Duration' : 'अवधि', value: answers.duration || '—', screen: 'duration' as Screen },
    { label: lang === 'en' ? 'Severity' : 'गंभीरता', value: answers.severity || '—', screen: 'severity' as Screen },
    { label: lang === 'en' ? 'Existing Conditions' : 'पुरानी बीमारियाँ', value: (answers.conditions || []).join(', ') || '—', screen: 'medical-conditions' as Screen },
    { label: lang === 'en' ? 'Medicines' : 'दवाइयाँ', value: answers.medicines || '—', screen: 'medicines' as Screen },
    { label: lang === 'en' ? 'Allergies' : 'एलर्जी', value: answers.allergies || '—', screen: 'allergies' as Screen },
    { label: lang === 'en' ? 'Previous Reports' : 'पुराने रिपोर्ट', value: answers.hasDocuments === 'yes' ? (lang === 'en' ? 'Yes — uploaded' : 'हाँ — अपलोड किया') : (lang === 'en' ? 'None' : 'कोई नहीं'), screen: 'documents' as Screen },
  ];
  return (
    <div className="min-h-full flex flex-col bg-mk-light screen-enter">
      <div className="px-4 py-4 border-b border-mk-gray bg-white">
        <h2 className={`text-2xl font-black text-mk-navy text-center ${lang === 'hi' ? 'font-devanagari' : ''}`}>{t.reviewTitle}</h2>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-3">
        {rows.map(r => (
          <div key={r.label} className="bg-white rounded-2xl border border-mk-gray p-4 flex items-center gap-4">
            <div className="flex-1">
              <div className="text-mk-muted font-semibold text-sm uppercase tracking-wider">{r.label}</div>
              <div className={`font-bold text-lg text-mk-text capitalize ${lang === 'hi' ? 'font-devanagari' : ''}`}>{r.value}</div>
            </div>
            <button
              onClick={() => onEdit(r.screen)}
              className="btn-tap px-4 py-2 rounded-xl bg-mk-light border border-mk-blue text-mk-navy font-bold text-sm hover:bg-mk-blue/20 transition-all"
            >
              {t.editBtn}
            </button>
          </div>
        ))}
      </div>
      <div className="px-4 pb-6 space-y-3">
        <button
          onClick={onNext}
          className="btn-tap w-full py-6 rounded-3xl bg-mk-success text-white font-black text-xl shadow hover:opacity-90 transition-all"
        >
          {t.submitBtn}
        </button>
        <button onClick={onBack} className="btn-tap w-full py-4 rounded-xl text-mk-muted font-bold text-base hover:text-mk-deep transition-all">
          {t.back}
        </button>
      </div>
    </div>
  );
}

function ProcessingScreen({
  lang,
  onDone,
}: {
  lang: Lang;
  onDone: () => void;
}) {
  const t = T[lang];
  const steps = [
    lang === 'en' ? 'Patient information' : 'रोगी जानकारी',
    lang === 'en' ? 'Symptoms' : 'लक्षण',
    lang === 'en' ? 'Medical history' : 'चिकित्सा इतिहास',
    lang === 'en' ? 'Medicines' : 'दवाइयाँ',
    lang === 'en' ? 'Allergies' : 'एलर्जी',
    lang === 'en' ? 'Previous reports' : 'पुराने रिपोर्ट',
    lang === 'en' ? 'Investigation results' : 'जाँच परिणाम',
  ];
  const [done, setDone] = useState(0);

  useEffect(() => {
    if (done >= steps.length) { setTimeout(onDone, 800); return; }
    const timer = setTimeout(() => setDone(d => d + 1), 500);
    return () => clearTimeout(timer);
  }, [done]);

  return (
    <div className="min-h-full flex flex-col items-center justify-center bg-mk-light px-6 py-12 gap-8 screen-enter">
      <div className="w-24 h-24 rounded-full bg-mk-navy flex items-center justify-center">
        <span className="text-5xl">🧠</span>
      </div>
      <h2 className={`text-3xl font-black text-mk-navy text-center ${lang === 'hi' ? 'font-devanagari' : ''}`}>{t.processingTitle}</h2>
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-md border border-mk-gray p-6 flex flex-col gap-4">
        {steps.map((s, i) => (
          <div key={s} className={`flex items-center gap-3 transition-all duration-500 ${i < done ? 'opacity-100' : 'opacity-30'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-black transition-all ${i < done ? 'bg-mk-success text-white step-check' : 'bg-mk-gray text-mk-muted'}`}>
              {i < done ? '✓' : i + 1}
            </div>
            <span className={`font-semibold text-lg ${lang === 'hi' ? 'font-devanagari' : ''}`} style={{ color: i < done ? '#047857' : '#4a5a7a' }}>{s}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function CompletedScreen({
  lang,
  onDoctorView,
  onRestart,
}: {
  lang: Lang;
  onDoctorView: () => void;
  onRestart: () => void;
}) {
  const t = T[lang];
  return (
    <div className="min-h-full flex flex-col items-center justify-center bg-mk-light px-6 py-12 gap-8 screen-enter">
      <div className="w-40 h-40 rounded-full bg-mk-success flex items-center justify-center shadow-xl">
        <span className="text-7xl">✅</span>
      </div>
      <div className="text-center space-y-3">
        <h1 className={`text-4xl font-black text-mk-navy ${lang === 'hi' ? 'font-devanagari' : ''}`}>{t.completedTitle}</h1>
        <p className={`text-2xl text-mk-muted font-bold ${lang === 'hi' ? 'font-devanagari' : ''}`}>{t.completedSubtitle}</p>
      </div>
      <div className="bg-mk-mint border-2 border-emerald-200 rounded-2xl px-6 py-5 max-w-sm text-center">
        <p className={`text-mk-success font-bold text-xl ${lang === 'hi' ? 'font-devanagari' : ''}`}>{t.sentToTeam}</p>
      </div>
      <div className="w-full max-w-sm space-y-4">
        <button
          onClick={onDoctorView}
          className="btn-tap w-full py-5 rounded-2xl bg-mk-navy text-white font-bold text-lg hover:bg-mk-deep transition-all"
        >
          🩺 {lang === 'en' ? 'View Doctor Summary' : 'डॉक्टर सारांश देखें'}
        </button>
        <button
          onClick={onRestart}
          className="btn-tap w-full py-4 rounded-2xl bg-white border-2 border-mk-gray text-mk-muted font-bold text-lg hover:bg-mk-light transition-all"
        >
          🔄 {lang === 'en' ? 'New Patient' : 'नया मरीज़'}
        </button>
      </div>
    </div>
  );
}

function DoctorDashboard({
  lang,
  answers,
  onClose,
}: {
  lang: Lang;
  answers: Answers;
  onClose: () => void;
}) {
  const t = T[lang];
  const sections = [
    { title: 'Chief Complaint', content: answers.complaint || 'Chest pain', icon: '🩺' },
    { title: 'History of Present Illness', content: `Duration: ${answers.duration || '2-3 days'} | Severity: ${answers.severity || 'Moderate'} | Location: ${(answers.locations || ['chest']).join(', ')}`, icon: '📝' },
    { title: 'Past Medical History', content: (answers.conditions || ['Hypertension']).join(', '), icon: '📚' },
    { title: 'Past Surgical History', content: 'None reported', icon: '🔪' },
    { title: 'Current Medications', content: answers.medicines === 'yes' ? 'Yes — see scanned prescription' : answers.medicines === 'no' ? 'None' : 'Not confirmed', icon: '💊' },
    { title: 'Drug/Food Allergies', content: answers.allergies === 'yes' ? 'Yes — further detail needed' : answers.allergies === 'no' ? 'None reported' : 'Not confirmed', icon: '⚠️' },
    { title: 'Family History', content: answers.familyHistory === 'yes' ? 'Yes — details pending' : answers.familyHistory === 'no' ? 'Negative' : 'Not confirmed', icon: '👨‍👩‍👧' },
    { title: 'Personal History', content: `Smoking: ${answers.smokes || 'Not reported'} | Alcohol: ${answers.alcohol || 'Not reported'} | Activity: ${answers.activity || 'Not reported'}`, icon: '🏃' },
    { title: 'Review of Systems', content: `Breathing difficulty: ${answers.breathingDiff || 'Not reported'}`, icon: '🫁' },
    { title: 'Previous Investigations', content: 'BP: 150/95 mmHg (Aug 2026) — Hypertension', icon: '🔬' },
    { title: 'Medical Document Timeline', content: '2024: Hypertension Dx | 2025: Amlodipine Rx | 2026: BP check', icon: '📅' },
    { title: 'AI Red-Flag Alerts', content: answers.severity === 'very-severe' ? '⚠️ Very severe symptoms reported — urgent review needed' : 'No red flags detected', icon: '🚨' },
  ];
  return (
    <div className="min-h-full flex flex-col bg-mk-light screen-enter">
      {/* Header */}
      <div className="bg-mk-navy px-6 py-5">
        <div className="flex items-center justify-between mb-3">
          <button onClick={onClose} className="text-white/70 hover:text-white font-bold text-sm transition-colors">← Back</button>
          <span className="text-white/60 text-xs font-semibold">{lang === 'en' ? 'Doctor Mode' : 'डॉक्टर मोड'}</span>
        </div>
        <h1 className="text-white font-black text-xl">{t.doctorTitle}</h1>
        <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-amber-400/20 border border-amber-400/40 rounded-full">
          <span className="text-amber-300 text-xs font-bold">{t.aiDraft}</span>
        </div>
      </div>

      {/* Patient Info */}
      <div className="bg-white border-b border-mk-gray px-6 py-4">
        <div className="grid grid-cols-3 gap-4">
          {[
            ['Name', 'Ram Kumar'],
            ['Age', '58 years'],
            ['Gender', 'Male'],
            ['ABHA ID', 'New Patient'],
            ['Language', lang === 'en' ? 'English' : 'Hindi'],
            ['Reg No.', 'MK-2026-0042'],
          ].map(([k, v]) => (
            <div key={k}>
              <div className="text-mk-muted text-xs font-semibold uppercase tracking-wide">{k}</div>
              <div className="font-bold text-mk-text text-base">{v}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-2 px-4 py-3 bg-white border-b border-mk-gray">
        {['Edit', 'Confirm', 'View Original', 'Patient Answers'].map(b => (
          <button key={b} className="btn-tap px-3 py-2 rounded-xl bg-mk-light border border-mk-blue text-mk-navy font-bold text-xs hover:bg-mk-blue/20 transition-all">
            {b}
          </button>
        ))}
      </div>

      {/* Sections */}
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
        {sections.map(s => (
          <div key={s.title} className={`bg-white rounded-2xl border p-4 ${s.title === 'AI Red-Flag Alerts' && answers.severity === 'very-severe' ? 'border-red-400 bg-red-50' : 'border-mk-gray'}`}>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">{s.icon}</span>
              <span className="font-black text-mk-navy text-sm uppercase tracking-wide">{s.title}</span>
            </div>
            <p className="text-mk-text font-semibold text-base leading-relaxed">{s.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function AyushScreen({
  lang,
  onBack,
}: {
  lang: Lang;
  onBack: () => void;
}) {
  const t = T[lang];
  const [prakriti, setPrakriti] = useState('');
  const prakritiOpts = [
    { v: 'vata', label: t.vata, icon: '💨', desc: lang === 'en' ? 'Thin, creative, energetic' : 'पतला, रचनात्मक, ऊर्जावान' },
    { v: 'pitta', label: t.pitta, icon: '🔥', desc: lang === 'en' ? 'Medium build, sharp mind' : 'मध्यम काया, तेज़ दिमाग' },
    { v: 'kapha', label: t.kapha, icon: '🌊', desc: lang === 'en' ? 'Strong, calm, heavy build' : 'मज़बूत, शांत, भारी काया' },
    { v: 'unknown', label: t.notKnown, icon: '🤔', desc: '' },
  ];
  const ayushQuestions = [
    { icon: '🌿', q: lang === 'en' ? 'Prakriti (Body Type)' : 'प्रकृति (शरीर प्रकार)' },
    { icon: '🏥', q: lang === 'en' ? 'Vikriti (Current Imbalance)' : 'विकृति (वर्तमान असंतुलन)' },
    { icon: '✨', q: lang === 'en' ? 'Sara (Tissue Quality)' : 'सार (ऊतक गुणवत्ता)' },
    { icon: '💪', q: lang === 'en' ? 'Samhanana (Build)' : 'संहनन (शरीर गठन)' },
    { icon: '📏', q: lang === 'en' ? 'Pramana (Measurements)' : 'प्रमाण (माप)' },
    { icon: '🍲', q: lang === 'en' ? 'Satmya (Dietary Compatibility)' : 'सात्म्य (आहार अनुकूलता)' },
    { icon: '🧠', q: lang === 'en' ? 'Sattva (Mental Strength)' : 'सत्त्व (मानसिक शक्ति)' },
  ];
  return (
    <div className="min-h-full flex flex-col bg-mk-light screen-enter">
      <div className="bg-emerald-700 px-6 py-5">
        <button onClick={onBack} className="text-white/70 hover:text-white font-bold text-sm mb-3 block transition-colors">← Back</button>
        <div className="flex items-center gap-3">
          <span className="text-4xl">🌿</span>
          <div>
            <h1 className={`text-white font-black text-xl ${lang === 'hi' ? 'font-devanagari' : ''}`}>{t.ayushTitle}</h1>
            <p className={`text-emerald-200 text-sm font-semibold ${lang === 'hi' ? 'font-devanagari' : ''}`}>{t.prakritiQ}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-5">
        {/* Prakriti assessment */}
        <div className="bg-white rounded-3xl border border-mk-gray p-5">
          <h3 className={`font-black text-mk-navy text-lg mb-4 ${lang === 'hi' ? 'font-devanagari' : ''}`}>{t.prakritiQ}</h3>
          <div className="grid grid-cols-2 gap-3">
            {prakritiOpts.map(o => (
              <button
                key={o.v}
                onClick={() => setPrakriti(o.v)}
                className={`btn-tap py-5 px-3 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${
                  prakriti === o.v ? 'bg-emerald-50 border-emerald-500' : 'bg-mk-light border-mk-gray hover:border-emerald-300'
                }`}
              >
                <span className="text-4xl">{o.icon}</span>
                <span className={`font-bold text-base text-center leading-tight ${prakriti === o.v ? 'text-emerald-800' : 'text-mk-text'} ${lang === 'hi' ? 'font-devanagari' : ''}`}>{o.label}</span>
                {o.desc && <span className={`text-xs text-mk-muted text-center ${lang === 'hi' ? 'font-devanagari' : ''}`}>{o.desc}</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Upcoming questions list */}
        <div className="bg-white rounded-3xl border border-mk-gray p-5">
          <h3 className="font-black text-mk-navy text-lg mb-4">{lang === 'en' ? 'Assessment Includes' : 'मूल्यांकन में शामिल'}</h3>
          <div className="flex flex-col gap-3">
            {ayushQuestions.map((q, i) => (
              <div key={i} className={`flex items-center gap-3 py-3 border-b border-mk-gray/50 ${i === 0 ? 'opacity-100' : 'opacity-60'}`}>
                <span className="text-2xl">{q.icon}</span>
                <span className={`font-semibold text-base text-mk-text ${lang === 'hi' ? 'font-devanagari' : ''}`}>{q.q}</span>
                {i === 0 && <span className="ml-auto text-emerald-500 font-bold text-sm">Current</span>}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="px-4 pb-6">
        <button
          disabled={!prakriti}
          className={`btn-tap w-full py-5 rounded-2xl font-bold text-xl transition-all ${
            prakriti ? 'bg-emerald-700 text-white hover:bg-emerald-800' : 'bg-mk-gray text-mk-muted cursor-not-allowed'
          }`}
        >
          {lang === 'en' ? 'Continue →' : 'आगे बढ़ें →'}
        </button>
      </div>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────

export default function App() {
  const [screen, setScreen] = useState<Screen>('welcome');
  const [lang, setLang] = useState<Lang>('en');
  const [helpMode, setHelpMode] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [answers, setAnswers] = useState<Answers>({ locations: [], conditions: [] });

  const toggleLang = () => setLang(l => l === 'en' ? 'hi' : 'en');
  const toggleHelp = () => setHelpMode(h => !h);

  const handleRepeat = useCallback(() => {
    setIsSpeaking(true);
    // Simulate TTS
    if ('speechSynthesis' in window) {
      const t = T[lang];
      const questionMap: Partial<Record<Screen, string>> = {
        consent: t.consentQ,
        'patient-id': t.patientIdQ,
        'main-complaint': t.complaintQ,
        duration: t.durationQ,
        severity: t.severityQ,
        location: t.locationQ,
        'symptom-followup': t.followupQ,
        'medical-conditions': t.conditionsQ,
        medicines: t.medicinesQ,
        allergies: t.allergiesQ,
        'family-history': t.familyQ,
        'lifestyle-smoke': t.smokeQ,
        'lifestyle-alcohol': t.alcoholQ,
        'lifestyle-activity': t.activityQ,
        'review-systems': t.breathingQ,
        documents: t.documentsQ,
      };
      const txt = questionMap[screen];
      if (txt) {
        window.speechSynthesis.cancel();
        const utt = new SpeechSynthesisUtterance(txt);
        utt.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';
        utt.onend = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utt);
      } else {
        setTimeout(() => setIsSpeaking(false), 2000);
      }
    } else {
      setTimeout(() => setIsSpeaking(false), 2000);
    }
  }, [screen, lang]);

  // Auto-speak on screen change
  useEffect(() => {
    if (QUESTION_SCREENS.includes(screen)) {
      handleRepeat();
    }
  }, [screen]);

  const updateAnswer = (key: keyof Answers, value: Answers[keyof Answers]) => {
    setAnswers(a => ({ ...a, [key]: value }));
  };

  const goNext = () => setScreen(s => nextScreen(s, answers));
  const goBack = () => setScreen(s => prevScreen(s));

  const stepIndex = QUESTION_SCREENS.indexOf(screen);
  const currentStep = stepIndex >= 0 ? stepIndex + 1 : 1;
  const totalSteps = QUESTION_SCREENS.length;

  const topBarProps = {
    lang,
    helpMode,
    isSpeaking,
    onToggleHelp: toggleHelp,
    onRepeat: handleRepeat,
    onLangToggle: toggleLang,
  };

  // ── Screen Router ──────────────────────────────────────────────────────────

  if (screen === 'welcome') {
    return (
      <WelcomeScreen
        lang={lang}
        onStart={() => setScreen('consent')}
        onLangToggle={toggleLang}
        onDoctorMode={() => setScreen('doctor-dashboard')}
        onAyushMode={() => setScreen('ayush-mode')}
      />
    );
  }

  if (screen === 'consent') {
    return (
      <ConsentScreen
        {...topBarProps}
        onNext={(v) => { if (v === 'yes') setScreen('patient-id'); else setScreen('welcome'); }}
        onBack={goBack}
      />
    );
  }

  if (screen === 'patient-id') {
    return <PatientIdScreen {...topBarProps} onNext={goNext} onBack={goBack} />;
  }

  if (screen === 'main-complaint') {
    return (
      <MainComplaintScreen
        {...topBarProps}
        value={answers.complaint}
        onChange={v => updateAnswer('complaint', v)}
        onNext={goNext}
        onBack={goBack}
        step={currentStep}
        total={totalSteps}
      />
    );
  }

  if (screen === 'duration') {
    return (
      <DurationScreen
        {...topBarProps}
        value={answers.duration}
        onChange={v => updateAnswer('duration', v)}
        onNext={goNext}
        onBack={goBack}
        step={currentStep}
        total={totalSteps}
      />
    );
  }

  if (screen === 'severity') {
    return (
      <SeverityScreen
        {...topBarProps}
        value={answers.severity}
        onChange={v => updateAnswer('severity', v)}
        onNext={goNext}
        onBack={goBack}
        step={currentStep}
        total={totalSteps}
      />
    );
  }

  if (screen === 'location') {
    return (
      <LocationScreen
        {...topBarProps}
        value={answers.locations || []}
        onChange={v => updateAnswer('locations', v)}
        onNext={goNext}
        onBack={goBack}
        step={currentStep}
        total={totalSteps}
      />
    );
  }

  if (screen === 'symptom-followup') {
    return (
      <SimpleYesNoScreen
        {...topBarProps}
        question={T[lang].followupQ}
        helpText={T[lang].followupHelp}
        icon="💓"
        value={answers.spreadsPain}
        onChange={v => updateAnswer('spreadsPain', v)}
        onNext={goNext}
        onBack={goBack}
        step={currentStep}
        total={totalSteps}
        extraContent={
          <div className="mx-4 p-4 rounded-2xl bg-mk-light border border-mk-blue flex gap-3 items-center">
            <span className="text-2xl">ℹ️</span>
            <p className="text-mk-navy font-semibold text-sm">
              {lang === 'en'
                ? 'This question adapts based on your earlier answers about chest pain.'
                : 'यह प्रश्न छाती दर्द के बारे में आपके पहले के उत्तरों के आधार पर बदलता है।'}
            </p>
          </div>
        }
      />
    );
  }

  if (screen === 'medical-conditions') {
    return (
      <MedicalConditionsScreen
        {...topBarProps}
        value={answers.conditions || []}
        onChange={v => updateAnswer('conditions', v)}
        onNext={goNext}
        onBack={goBack}
        step={currentStep}
        total={totalSteps}
      />
    );
  }

  if (screen === 'medicines') {
    return (
      <SimpleYesNoScreen
        {...topBarProps}
        question={T[lang].medicinesQ}
        helpText={T[lang].medicinesHelp}
        icon="💊"
        value={answers.medicines}
        onChange={v => updateAnswer('medicines', v)}
        onNext={goNext}
        onBack={goBack}
        step={currentStep}
        total={totalSteps}
        extraContent={
          answers.medicines === 'yes' ? (
            <div className="px-4">
              <button className="btn-tap w-full py-5 rounded-2xl bg-mk-navy text-white font-bold text-xl flex items-center justify-center gap-3 hover:bg-mk-deep transition-all">
                📷 {T[lang].scanPrescription.replace('📷  ', '')}
              </button>
            </div>
          ) : null
        }
      />
    );
  }

  if (screen === 'allergies') {
    return (
      <SimpleYesNoScreen
        {...topBarProps}
        question={T[lang].allergiesQ}
        helpText={T[lang].allergiesHelp}
        icon="⚠️"
        value={answers.allergies}
        onChange={v => updateAnswer('allergies', v)}
        onNext={goNext}
        onBack={goBack}
        step={currentStep}
        total={totalSteps}
      />
    );
  }

  if (screen === 'family-history') {
    return (
      <SimpleYesNoScreen
        {...topBarProps}
        question={T[lang].familyQ}
        helpText={T[lang].familyHelp}
        icon="👨‍👩‍👧"
        value={answers.familyHistory}
        onChange={v => updateAnswer('familyHistory', v)}
        onNext={goNext}
        onBack={goBack}
        step={currentStep}
        total={totalSteps}
      />
    );
  }

  if (screen === 'lifestyle-smoke') {
    return (
      <SimpleYesNoScreen
        {...topBarProps}
        question={T[lang].smokeQ}
        helpText={T[lang].smokeHelp}
        icon="🚬"
        value={answers.smokes}
        onChange={v => updateAnswer('smokes', v)}
        onNext={goNext}
        onBack={goBack}
        step={currentStep}
        total={totalSteps}
      />
    );
  }

  if (screen === 'lifestyle-alcohol') {
    return (
      <SimpleYesNoScreen
        {...topBarProps}
        question={T[lang].alcoholQ}
        helpText={T[lang].alcoholHelp}
        icon="🍺"
        value={answers.alcohol}
        onChange={v => updateAnswer('alcohol', v)}
        onNext={goNext}
        onBack={goBack}
        step={currentStep}
        total={totalSteps}
      />
    );
  }

  if (screen === 'lifestyle-activity') {
    return (
      <ActivityScreen
        {...topBarProps}
        value={answers.activity}
        onChange={v => updateAnswer('activity', v)}
        onNext={goNext}
        onBack={goBack}
        step={currentStep}
        total={totalSteps}
      />
    );
  }

  if (screen === 'review-systems') {
    return (
      <SimpleYesNoScreen
        {...topBarProps}
        question={T[lang].breathingQ}
        helpText={T[lang].breathingHelp}
        icon="🫁"
        value={answers.breathingDiff}
        onChange={v => updateAnswer('breathingDiff', v)}
        onNext={goNext}
        onBack={goBack}
        step={currentStep}
        total={totalSteps}
      />
    );
  }

  if (screen === 'documents') {
    return (
      <DocumentsScreen
        {...topBarProps}
        onChange={v => updateAnswer('hasDocuments', v)}
        onNext={v => { updateAnswer('hasDocuments', v); setScreen(v === 'yes' ? 'ocr-processing' : 'medical-timeline'); }}
        onBack={goBack}
        step={currentStep}
        total={totalSteps}
      />
    );
  }

  if (screen === 'ocr-processing') {
    return <OcrProcessingScreen lang={lang} onDone={() => setScreen('document-results')} />;
  }

  if (screen === 'document-results') {
    return <DocumentResultsScreen lang={lang} onNext={() => setScreen('medical-timeline')} onBack={() => setScreen('ocr-processing')} />;
  }

  if (screen === 'red-flag') {
    return (
      <RedFlagScreen
        lang={lang}
        onCallStaff={() => {}}
        onContinue={() => setScreen('location')}
      />
    );
  }

  if (screen === 'medical-timeline') {
    return <MedicalTimelineScreen lang={lang} onNext={() => setScreen('final-review')} onBack={goBack} />;
  }

  if (screen === 'final-review') {
    return (
      <FinalReviewScreen
        lang={lang}
        answers={answers}
        onNext={() => setScreen('processing')}
        onBack={goBack}
        onEdit={s => setScreen(s)}
      />
    );
  }

  if (screen === 'processing') {
    return <ProcessingScreen lang={lang} onDone={() => setScreen('completed')} />;
  }

  if (screen === 'completed') {
    return (
      <CompletedScreen
        lang={lang}
        onDoctorView={() => setScreen('doctor-dashboard')}
        onRestart={() => { setAnswers({ locations: [], conditions: [] }); setScreen('welcome'); }}
      />
    );
  }

  if (screen === 'doctor-dashboard') {
    return <DoctorDashboard lang={lang} answers={answers} onClose={() => setScreen('completed')} />;
  }

  if (screen === 'ayush-mode') {
    return <AyushScreen lang={lang} onBack={() => setScreen('welcome')} />;
  }

  return null;
}
