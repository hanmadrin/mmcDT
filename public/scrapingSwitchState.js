const getSwitchState = async () => {
    const response = await fetch('/api/extensions/get-switch-status', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
    });
    const data = await response.json();
    return data.extensionSwitch;
};

export default getSwitchState;