export const checkMicrophonePermission = async () => {
  const { state } = await navigator.permissions.query({ name: 'microphone' });

  return state === 'granted';
};

export const askMicrophonePermissions = async () => {
  try {
    // eslint-disable-next-line compat/compat
    await navigator.mediaDevices.getUserMedia({ audio: true });

    return true;
  } catch {
    return false;
  }
};
