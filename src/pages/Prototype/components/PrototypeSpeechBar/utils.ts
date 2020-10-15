export const checkMicrophonePermission = async () => {
  let hasMicrophonePermissions = false;
  // eslint-disable-next-line compat/compat
  await navigator.mediaDevices
    .getUserMedia({ audio: true })
    .then(() => {
      hasMicrophonePermissions = true;
    })
    .catch((err) => {
      console.error(err);
    });
  return hasMicrophonePermissions;
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
