const groundSetup = () => {
    const main = document.createElement('div');
    main.id = 'main';
    const popup = document.createElement('div');
    popup.id = 'popup';
    const notify = document.createElement('div');
    notify.id = 'notify';
    notify.classList = 'position-fixed right-30px top-30px zindex-8 overflow-y-auto w-200px h-100vh pointer-events-none';
    document.body.replaceChildren(main, popup, notify);
}
const sleep = async (ms) => {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}
const notify = async ({ data, type }) => {
    const notify = document.getElementById('notify');
    const newNotification = document.createElement('div');
    newNotification.classList = 'cursor-pointer my-10px';
    const notification = document.createElement('div');
    notification.classList = 'text-white p-10px border-radius-5px opacity-80';
    notification.classList.add(`bg-${type}`);
    notification.innerText = data;
    newNotification.append(notification);
    notify.appendChild(newNotification);
    newNotification.onclick = () => {
        newNotification.remove();
    }
    await sleep(3000);
    newNotification.remove();
}
const crossButton = ({ size = 30, options = { color: 'white' } }) => {
    const designCross = document.createElement('div');
    const crossButton = document.createElement('div');
    const designCrossFirst = document.createElement('div');
    const designCrossSecond = document.createElement('div');
    designCrossFirst.classList = 'first';
    designCrossSecond.classList = 'second';
    designCrossFirst.style.backgroundColor = options.color;
    designCrossSecond.style.backgroundColor = options.color;
    designCross.append(designCrossFirst, designCrossSecond);
    designCross.classList = 'design-cross';
    designCross.style.height = `${size}px`;
    designCross.style.width = `${size}px`;
    designCrossFirst.style.left = `${size / 2 - (size / 100 * 5)}px`;
    designCrossSecond.style.left = `${size / 2 - (size / 100 * 5)}px`;
    designCrossFirst.style.height = `${size}px`;
    designCrossSecond.style.height = `${size}px`;
    designCrossFirst.style.width = `${size / 100 * 10}px`;
    designCrossSecond.style.width = `${size / 100 * 10}px`;
    designCrossFirst.style.borderRadius = `${size / 100 * 10}px`;
    designCrossSecond.style.borderRadius = `${size / 100 * 10}px`;
    crossButton.classList = 'position-relative d-flex justify-content-center align-items-center cursor-pointer';
    crossButton.style.height = `${size}px`;
    crossButton.style.width = `${size}px`;
    crossButton.append(designCross);
    return crossButton;
}
const confirmationPopup = ({ title, message, callback, negativeCallBack }) => {
    const content = document.createElement('div');
    content.classList = 'h-300px d-flex flex-column justify-content-evenly align-items-center bg-dark border-radius-10px px-20px';
    content.addEventListener('click', (e) => {
        e.stopPropagation();
    });
    const warningTitle = document.createElement('div');
    warningTitle.innerText = title;
    warningTitle.classList = 'text-center font-header';
    const warningMessage = document.createElement('div');
    warningMessage.innerText = message;
    warningMessage.classList = 'text-center font-normal';
    const warningButtonDiv = document.createElement('div');
    warningButtonDiv.classList = 'd-flex justify-content-evenly align-items-center w-100';
    const warningButton = document.createElement('div');
    const negativeWarningButton = document.createElement('div');
    warningButton.classList = 'mr-10px text-center font-normal cursor-pointer align-self-center bg-primary border-radius-5px p-15px';
    negativeWarningButton.classList = 'text-center font-normal cursor-pointer align-self-center bg-danger border-radius-5px p-15px';
    warningButton.innerText = 'Yes';
    negativeWarningButton.innerText = 'No';
    warningButton.addEventListener('click', async () => {
        await callback();
    });
    negativeWarningButton.addEventListener('click', async () => {
        await negativeCallBack();
    });
    warningButtonDiv.append(warningButton, negativeWarningButton);
    content.append(warningTitle, warningMessage, warningButtonDiv);
    return content;
}
const popup = ({ state, content, options = { backDrop: true, removeButton: true, removeButtonSize: 20, backDropColor: 'rgba(0,0,0,0)' } }) => {
    const popup = document.getElementById('popup');
    const removePopup = () => {
        popup.classList = '';
        popup.replaceChildren();
    };
    removePopup();
    if (state) {
        popup.classList = 'h-100vh w-100vw d-flex flex-column justify-content-center align-items-center position-fixed top-0 left-0';
        popup.style.backgroundColor = options.backDropColor;
        const popupContent = document.createElement('div');
        popupContent.append(content);
        popupContent.classList = 'position-relative';
        popup.append(popupContent);
        if (options.removeButton) {
            const crossButtonHolder = document.createElement('div');
            crossButtonHolder.classList = 'position-absolute top-0 right-0';
            crossButtonHolder.append(crossButton({ size: options.removeButtonSize }));
            crossButtonHolder.addEventListener('click', () => {
                removePopup();
            });
            popupContent.append(crossButtonHolder);
        }
        if (options.backDrop) {
            popup.addEventListener('click', () => {
                removePopup();
            });
        }
    }
}
export { groundSetup, notify, popup, sleep, confirmationPopup };