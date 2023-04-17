import { VoiceflowConstants } from '@voiceflow/voiceflow-types';

const BUILT_IN_NO_REPLIES_BY_LANGUAGE = {
  [VoiceflowConstants.Language.EN]: [
    "I'm sorry, I didn't receive a response. Can you please let me know how I can assist you?",
    'I apologize if my previous message was unclear. Could you please let me know what you need help with?',
    "It looks like I didn't receive a reply from you. Is there something specific you'd like to know or discuss?",
    "I'm here to help with any questions or concerns you have. Is there anything you'd like to ask or talk about?",
    "I apologize if I missed your response. Is there anything you'd like to know or discuss?",
    "I'm here to assist you with any questions or concerns. Is there anything you'd like to ask me about?",
    "I'm sorry if my previous message was not helpful. Is there anything else you'd like to know or discuss?",
    'I apologize if my previous message was confusing. Could you please let me know what you need help with?',
    "I didn't receive a response from you. Is there anything specific you'd like to know or discuss?",
    "I'm here to help with any questions or concerns you have. Is there something specific you'd like to ask or talk about?",
  ],

  [VoiceflowConstants.Language.AR]: [
    'أعتذر، لم يتم تلقي رد. هل يمكنك المساعدة في تحديد كيف يمكنني مساعدتك؟',
    'أعتذر إذا كان رسالتي السابقة غير واضحة. هل يمكنك المساعدة في تحديد ما الذي تحتاج إلى المساعدة فيه؟',
    'يبدو أنني لم أتلق رد. هل هناك شيء معين يريد معرفته أو مناقشته؟',
    'أنا هنا للمساعدة في أي استفسارات أو مخاوف لديك. هل هناك شيء معين يريد أن يسألني عنه أو يتحدث عنه؟',
    'أعتذر إذا فاتتني ردودك. هل هناك شيء معين يريد معرفته أو مناقشته؟',
    'أنا هنا للمساعدة في أي استفسارات أو مخاوف لديك. هل هناك شيء معين يريد أن يسألني عنه؟',
    'أعتذر إذا كان رسالتي السابقة لا تساعد. هل هناك شيء آخر يريد معرفته أو مناقشته؟',
    'أعتذر إذا كان رسالتي السابقة مربكة. هل يمكنك المساعدة في تحديد ما الذي تحتاج إلى المساعدة فيه؟',
  ],

  [VoiceflowConstants.Language.ZH]: [
    '对不起，我没有收到回复。请告诉我如何帮助您。',
    '如果我之前的消息不清楚，我深表歉意。您需要帮助哪方面？',
    '看起来我没有收到您的回复。您有什么特别想知道或讨论的吗？',
    '我来帮助您解答任何问题或疑虑。您有什么要问或谈论的吗？',
    '如果我错过了您的回复，我深表歉意。您有什么想知道或讨论的吗？',
    '我来帮助您解决任何问题或疑虑。您有什么想问我的吗？',
    '如果我之前的消息没有帮助，我深表歉意。您还有什么想知道或讨论的吗？',
    '如果我之前的消息令您困惑，我深表歉意。您需要帮助哪方面？',
    '我没有收到您的回复。您有什么特别想知道或讨论的吗？',
    '我来帮助您解决任何问题或疑虑。您有什么特别要问或谈论的吗？',
  ],

  [VoiceflowConstants.Language.NL]: [
    'Het spijt me, ik heb geen reactie ontvangen. Kunt u me alstublieft laten weten hoe ik u kan helpen?',
    'Als mijn vorige bericht onduidelijk was, bied ik mijn verontschuldigingen aan. Kunt u me alstublieft laten weten waarmee u hulp nodig heeft?',
    'Het lijkt erop dat ik geen antwoord van u heb ontvangen. Heeft u iets specifieks waarover u wilt weten of waarover u wilt praten?',
    'Ik ben hier om te helpen met eventuele vragen of zorgen die u heeft. Heeft u iets wat u wilt vragen of waarover u wilt praten?',
    'Als ik uw reactie heb gemist, bied ik mijn verontschuldigingen aan. Heeft u iets waarover u wilt weten of waarover u wilt praten?',
    'Ik ben hier om u te helpen met eventuele vragen of zorgen. Heeft u iets wat u mij wilt vragen?',
    'Als mijn vorige bericht niet behulpzaam was, bied ik mijn verontschuldigingen aan. Heeft u nog iets anders waarover u wilt weten of waarover u wilt praten?',
    'Als mijn vorige bericht verwarrend was, bied ik mijn verontschuldigingen aan. Kunt u me alstublieft laten weten waarmee u hulp nodig heeft?',
    'Ik heb geen reactie van u ontvangen. Heeft u iets specifieks waarover u wilt weten of waarover u wilt praten?',
    'Ik ben hier om te helpen met eventuele vragen of zorgen die u heeft. Heeft u iets specifieks waarover u wilt vragen of waarover u wilt praten?',
  ],

  [VoiceflowConstants.Language.FR]: [
    "Désolé, je n'ai pas reçu de réponse. Pouvez-vous me dire comment je peux vous aider ?",
    "Si mon précédent message n'était pas clair, je vous présente mes excuses. Pourriez-vous me dire en quoi vous avez besoin d'aide ?",
    "Il semble que je n'ai pas reçu de réponse de votre part. Y a-t-il quelque chose de spécifique que vous aimeriez savoir ou discuter ?",
    'Je suis là pour vous aider avec toutes les questions ou les préoccupations que vous pourriez avoir. Y a-t-il quelque chose que vous aimeriez me demander ou discuter ?',
    "Si j'ai manqué votre réponse, je vous présente mes excuses. Y a-t-il quelque chose que vous aimeriez savoir ou discuter ?",
    'Je suis là pour vous aider avec toutes les questions ou les préoccupations que vous pourriez avoir. Y a-t-il quelque chose que vous aimeriez me demander ?',
    "Si mon précédent message n'était pas utile, je vous présente mes excuses. Y a-t-il autre chose que vous aimeriez savoir ou discuter ?",
    "Si mon précédent message était confus, je vous présente mes excuses. Pourriez-vous me dire en quoi vous avez besoin d'aide ?",
  ],

  [VoiceflowConstants.Language.DE]: [
    'Entschuldigung, ich habe keine Antwort erhalten. Können Sie mir bitte sagen, wie ich Ihnen helfen kann?',
    'Wenn meine vorherige Nachricht unklar war, bitte ich um Entschuldigung. Können Sie mir bitte sagen, wo Sie Hilfe benötigen?',
    'Es sieht so aus, als hätte ich keine Antwort von Ihnen erhalten. Gibt es etwas Spezielles, das Sie wissen oder besprechen möchten?',
    'Ich bin hier, um Ihnen bei allen Fragen oder Bedenken zu helfen. Gibt es etwas, das Sie mich fragen oder besprechen möchten?',
    'Wenn ich Ihre Antwort verpasst habe, bitte ich um Entschuldigung. Gibt es etwas, das Sie wissen oder besprechen möchten?',
    'Ich bin hier, um Ihnen bei allen Fragen oder Bedenken zu helfen. Gibt es etwas, das Sie mich fragen möchten?',
    'Wenn meine vorherige Nachricht nicht hilfreich war, bitte ich um Entschuldigung. Gibt es etwas anderes, das Sie wissen oder besprechen möchten?',
    'Wenn meine vorherige Nachricht verwirrend war, bitte ich um Entschuldigung. Können Sie mir bitte sagen, wo Sie Hilfe benötigen?',
    'Ich habe keine Antwort von Ihnen erhalten. Gibt es etwas Spezielles, das Sie wissen oder besprechen möchten?',
    'Ich bin hier, um Ihnen bei allen Fragen oder Bedenken zu helfen. Gibt es etwas Spezielles, das Sie mich fragen oder besprechen möchten?',
  ],

  [VoiceflowConstants.Language.GU]: [
    'માફ કરશો, મને જવાબ મળી નથી. તમે મને કોઈ મદદ કરી શકો છો કે મને કેવું મદદ કરી શકૂં તે જણાવીને?',
    'જો મારા પહેલાનો સંદેશ અસ્પષ્ટ હોય હોય તો, માફ કરશો. તમે કોઈ મદદ કરી માંગો છો કે મને કેવું મદદ કરી શકૂં તે જણાવીને?',
  ],

  [VoiceflowConstants.Language.HI]: [
    'आपने उत्तर नहीं दिया है, क्या आप सुनना चाहते हैं?',
    'आपने अभी तक कोई जवाब नहीं दिया है, क्या आपकी समस्याएं हैं?',
    'आपने अभी तक कोई उत्तर नहीं दिया है, क्या आपको मेरा सवाल समझ में आ गया?',
    'आपने अभी तक कोई जवाब नहीं दिया है, क्या आपको कोई सहायता चाहिए?',
    'आपने अभी तक कोई उत्तर नहीं दिया है, क्या आप संभवतः हमारे बातें सुन रहे हैं?',
    'आपने अभी तक कोई जवाब नहीं दिया है, आपको कोई और सुझाव चाहिए?',
    'आपने अभी तक कोई उत्तर नहीं दिया है, क्या आपको कोई अन्य सवाल है?',
  ],

  [VoiceflowConstants.Language.IT]: [
    'Non hai ancora risposto, vuoi sentire di nuovo la domanda?',
    'Non hai ancora risposto, hai dei problemi?',
    'Non hai ancora risposto, hai capito la mia domanda?',
    'Non hai ancora risposto, hai bisogno di aiuto?',
    'Non hai ancora risposto, stai ascoltando attentamente quello che dico?',
    'Non hai ancora risposto, vuoi che ti faccia altre proposte?',
    'Non hai ancora risposto, hai altre domande?',
    'Non hai ancora risposto, vuoi descrivermi il tuo problema in modo più dettagliato?',
    "Non hai ancora risposto, c'è qualcos'altro che posso fare per te?",
    'Non hai ancora risposto, vuoi che ti spieghi di nuovo il concetto in modo diverso?',
  ],

  [VoiceflowConstants.Language.JA]: [
    '返答がありませんでした、もう一度質問を聞きますか？',
    '返答がありませんでした、問題がありますか？',
    '返答がありませんでした、私の質問がわかりましたか？',
    '返答がありませんでした、助けが必要ですか？',
    '返答がありませんでした、私の話を注意深く聞いていますか？',
    '返答がありませんでした、他のアイデアを紹介しますか？',
    '返答がありませんでした、他に質問はありますか？',
    '返答がありませんでした、もっと詳しく問題を説明しますか？',
    '返答がありませんでした、あなたに他にできることはありますか？',
    '返答がありませんでした、別の方法で概念を説明しますか？',
  ],

  [VoiceflowConstants.Language.KO]: [
    '아직 응답하지 않으셨습니다. 질문을 다시 듣고 싶으신가요?',
    '아직 응답하지 않으셨습니다. 어려움이 있으신가요?',
    '아직 응답하지 않으셨습니다. 내 질문을 이해하셨나요?',
    '아직 응답하지 않으셨습니다. 도움이 필요하신가요?',
    '아직 응답하지 않으셨습니다. 내 얘기를 정중히 듣고 계신가요?',
    '아직 응답하지 않으셨습니다. 다른 아이디어를 제시해 드릴까요?',
    '아직 응답하지 않으셨습니다. 다른 질문이 있으신가요?',
    '아직 응답하지 않으셨습니다. 자세히 설명해 주시겠어요?',
    '아직 응답하지 않으셨습니다. 다른 것을 할 수 있겠어요?',
    '아직 응답하지 않으셨습니다. 다른 방식으로 개념을 설명해 드릴까요?',
  ],

  [VoiceflowConstants.Language.MR]: [
    'आपण तुमच्या जवाबाची आणि आपल्या प्रश्नाची माहिती नमूद केलेली नाही, आपण जवाब देण्याची इच्छा आहे का?',
    'आपण तुमच्या जवाबाची आणि आपल्या प्रश्नाची माहिती नमूद केलेली नाही, तुम्ही काही समस्यांसहित आहात का?',
    'आपण तुमच्या जवाबाची आणि आपल्या प्रश्नाची माहिती नमूद केलेली नाही, माझे प्रश्न तुम्ही समजले आहे का?',
    'आपण तुमच्या जवाबाची आणि आपल्या प्रश्नाची माहिती नमूद केलेली नाही, तुम्ही मदत करण्याची जरूरी आहे का?',
  ],

  [VoiceflowConstants.Language.PT]: [
    'Desculpe, eu não consegui entender o que você escreveu. Poderia me explicar de outra maneira?',
    'Não consegui entender o que você quer. Poderia ser mais específico(a)?',
    'Desculpe, eu não consegui entender o que você está tentando dizer. Poderia reformular sua pergunta?',
    'Eu não consegui entender sua mensagem. Poderia me dizer de outra maneira o que você precisa?',
    'Desculpe, eu não consegui entender o que você escreveu. Poderia me explicar de outra maneira?',
    'Não consegui entender o que você quer. Poderia ser mais claro(a)?',
    'Desculpe, eu não consegui entender sua mensagem. Poderia reformular sua pergunta?',
    'Eu não consegui entender o que você está tentando dizer. Poderia me dizer de outra maneira o que você precisa?',
  ],

  [VoiceflowConstants.Language.ES]: [
    '¿Sigues ahí? ¿Puedes decirme lo que necesitas?',
    'No entendí lo que quisiste decir. ¿Podrías reformular tu pregunta?',
    'Lo siento, no entendí lo que escribiste. ¿Podrías explicarlo de otra manera?',
    'No entendí lo que quieres. ¿Podrías ser más específico?',
    'Lo siento, no entendí lo que estás tratando de decir. ¿Podrías reformular tu pregunta?',
    'No entendí tu mensaje. ¿Podrías decirme de otra manera lo que necesitas?',
    'Lo siento, no entendí lo que escribiste. ¿Podrías explicarlo de otra manera?',
    'No entendí lo que quieres. ¿Podrías ser más claro?',
    'Lo siento, no entendí tu mensaje. ¿Podrías reformular tu pregunta?',
    'No entendí lo que estás tratando de decir. ¿Podrías decirme de otra manera lo que necesitas?',
  ],

  [VoiceflowConstants.Language.TA]: [
    'நீங்கள் இன்னும் இங்கே உள்ளார்களா? நீங்களுக்கு எவை தேவையாகிறது என்று எனக்கு சொல்லவும்?',
    'எனக்கு உங்களுடன் எந்தவை பேச விட்டுள்ளது என்பதை நினைவில்லை. உங்கள் கேள்வியை மறுவிவரிக்க முடியுமா?',
    'என்ன வேண்டும் என்று நினைவில்லை. முன்னிருப்புக்கூடியதாக பயன்படுத்தவும்?',
    'மன்னிக்கவும், எனக்கு உங்கள் சொல்லின் என்ன போன்றதை பார்க்க முடியவில்லை. உங்கள் கேள்வியை மறுவிவரிக்க முடியுமா?',
  ],

  [VoiceflowConstants.Language.TE]: [
    'మీరు ఇంకా ఇక్కడ ఉన్నారు? మీరు ఎవరైనా అవసరం ఉంటే నాకు తెలుసుకోవాలనుకుంటున్నారు?',
    'నేను మీరు ఏమం చెప్పారు తెలుసలేదు. మీ ప్రశ్నని మళ్ళీ తరలించాలనుకుంటున్నారా?',
    'క్షమించండి, నేను మీరు చెప్పిన అంశాన్ని తెలుసలేదు. మీరు ఇంకా ఎలా వివరించాలనుకుంటున్నారు?',
  ],

  [VoiceflowConstants.Language.TR]: [
    'Hala buradasın mı? Ne ihtiyacın olduğunu bana söyleyebilir misin?',
    'Ne demek istediğini anlamadım. Sorma şeklini değiştirebilir misin?',
    'Ne istediğini anlamadım. Daha spesifik olabilir misin?',
    'Özür dilerim, ne demek istediğini anlayamadım. Sorma şeklini değiştirebilir misin?',
    'Mesajını anlayamadım. Ne ihtiyacın olduğunu başka bir şekilde söyleyebilir misin?',
    'Özür dilerim, yazdıklarını anlayamadım. Başka bir şekilde açıklayabilir misin?',
    'Ne istediğini anlamadım. Daha açık olabilir misin?',
    'Özür dilerim, mesajını anlayamadım. Sorma şeklini değiştirebilir misin?',
    'Ne demek istediğini anlayamadım. Ne ihtiyacın olduğunu başka bir şekilde söyleyebilir misin?',
  ],
} as const;

export const DEFAULT_BUILT_IN_NO_REPLIES = BUILT_IN_NO_REPLIES_BY_LANGUAGE[VoiceflowConstants.Language.EN];

export const BUILT_IN_NO_REPLIES_BY_LOCALE: Partial<Record<VoiceflowConstants.Locale, readonly string[]>> = {
  [VoiceflowConstants.Locale.EN_US]: BUILT_IN_NO_REPLIES_BY_LANGUAGE[VoiceflowConstants.Language.EN],
  [VoiceflowConstants.Locale.AR_AR]: BUILT_IN_NO_REPLIES_BY_LANGUAGE[VoiceflowConstants.Language.AR],
  [VoiceflowConstants.Locale.ZH_CN]: BUILT_IN_NO_REPLIES_BY_LANGUAGE[VoiceflowConstants.Language.ZH],
  [VoiceflowConstants.Locale.NL_NL]: BUILT_IN_NO_REPLIES_BY_LANGUAGE[VoiceflowConstants.Language.NL],
  [VoiceflowConstants.Locale.FR_FR]: BUILT_IN_NO_REPLIES_BY_LANGUAGE[VoiceflowConstants.Language.FR],
  [VoiceflowConstants.Locale.DE_DE]: BUILT_IN_NO_REPLIES_BY_LANGUAGE[VoiceflowConstants.Language.DE],
  [VoiceflowConstants.Locale.HI_IN]: BUILT_IN_NO_REPLIES_BY_LANGUAGE[VoiceflowConstants.Language.HI],
  [VoiceflowConstants.Locale.IT_IT]: BUILT_IN_NO_REPLIES_BY_LANGUAGE[VoiceflowConstants.Language.IT],
  [VoiceflowConstants.Locale.JA_JP]: BUILT_IN_NO_REPLIES_BY_LANGUAGE[VoiceflowConstants.Language.JA],
  [VoiceflowConstants.Locale.KO_KR]: BUILT_IN_NO_REPLIES_BY_LANGUAGE[VoiceflowConstants.Language.KO],
  [VoiceflowConstants.Locale.MR_IN]: BUILT_IN_NO_REPLIES_BY_LANGUAGE[VoiceflowConstants.Language.MR],
  [VoiceflowConstants.Locale.PT_BR]: BUILT_IN_NO_REPLIES_BY_LANGUAGE[VoiceflowConstants.Language.PT],
  [VoiceflowConstants.Locale.ES_ES]: BUILT_IN_NO_REPLIES_BY_LANGUAGE[VoiceflowConstants.Language.ES],
  [VoiceflowConstants.Locale.ES_MX]: BUILT_IN_NO_REPLIES_BY_LANGUAGE[VoiceflowConstants.Language.ES],
  [VoiceflowConstants.Locale.TA_IN]: BUILT_IN_NO_REPLIES_BY_LANGUAGE[VoiceflowConstants.Language.TA],
  [VoiceflowConstants.Locale.TE_IN]: BUILT_IN_NO_REPLIES_BY_LANGUAGE[VoiceflowConstants.Language.TE],
  [VoiceflowConstants.Locale.TR_TR]: BUILT_IN_NO_REPLIES_BY_LANGUAGE[VoiceflowConstants.Language.TR],

  [VoiceflowConstants.Locale.FR_CA]: [
    "Désolé, j'ai pas tout compris ce que tu voulais dire. Pourrais-tu reformuler ta question ou ta demande, s'il te plaît ?",
    "Pourrais-tu fournir plus de contexte ou préciser ta question, s'il te plaît ?",
    "J'ai de la misère à comprendre ton message. Pourrais-tu le reformuler de manière différente, s'il te plaît ?",
    "Désolé, mais je suis pas sûr de ce que tu me demandes. Pourrais-tu développer ou donner plus de détails, s'il te plaît ?",
    "Pourrais-tu fournir plus d'informations ou préciser ta question, s'il te plaît ? Je suis pas sûr de comprendre ce que tu me demandes.",
    "Désolé, j'ai pas compris ton message. Pourrais-tu l'expliquer de manière différente, s'il te plaît ?",
    "J'ai de la misère à suivre ta question. Pourrais-tu donner plus de détails ou la reformuler, s'il te plaît ?",
    "Désolé, mais je suis pas sûr de ce que tu veux dire. Pourrais-tu l'expliquer de manière différente, s'il te plaît ?",
    "Pourrais-tu préciser ta question ou fournir plus d'informations, s'il te plaît ? J'arrive pas à comprendre ce que tu me demandes.",
    "Désolé, j'ai pas compris ton message. Pourrais-tu le reformuler ou fournir plus de contexte, s'il te plaît ?",
  ],
};
