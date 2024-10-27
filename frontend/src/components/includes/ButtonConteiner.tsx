interface ButtonConteinerProps {
    buttonType?: "submit" | "reset" | "button",
    buttonName: string,
    buttonText: string,
    buttonFunction: () => void
}

function ButtonConteiner ({buttonType, buttonName, buttonText, buttonFunction}: ButtonConteinerProps) {
    return (
        <button type={buttonType} className={buttonName} onClick={buttonFunction}>
            {buttonText}
        </button>
    );
};

export default ButtonConteiner;
