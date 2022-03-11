import React, { PropsWithChildren, useCallback, useEffect, useState } from "react";

type Option = {
    title: string;
    activeText?: string;
    value: string;
};

export function Question(props: PropsWithChildren<{
    question: string | (() => JSX.Element);
    options: Option[];
    value?: string;
    onChange?: (title: string) => void;
}>) {
    const [unselected, setUnselected] = useState(false);

    let resubmitInfoClicked = (event: any) => {
        event.preventDefault();
        setUnselected(true);
    }

    if (unselected || props.value === undefined) {
        return (
            <div
                style={{
                    width: "100%",
                    background: "#292929",
                    paddingTop: "20px",
                    paddingLeft: "24px",
                    paddingRight: "24px",
                    borderRadius: "6px",
                    marginBottom: "10px",
                }}>
                <div style={{
                    fontSize: "24px",
                    color: "#ffffff",
                    fontWeight: 600,
                }}>
                    {typeof props.question === "string" ? props.question : props.question()}
                </div>
                <div
                    style={{
                        marginTop: "10px",
                        flexWrap: "wrap",
                        display: "flex",
                        paddingBottom: "20px"
                    }}>
                    {props.options.map(opt => (<Answer key={opt.value} title={opt.title} onClick={() => {
                        setUnselected(false);
                        if (props.onChange !== undefined) {
                            props.onChange(opt.value);
                        }
                    }} />))}
                </div>
            </div>
        );
    } else {
        // we always expect find to return a value, the object declaration is just to fix typescript
        const selectedOption = props.options.find(opt => opt.value === props.value) || {
            activeText: undefined,
            title: ""
        };
        return (
            <>
                <div
                    style={{
                        width: "100%",
                        display: "flex",
                        borderRadius: "6px",
                        background: "#292929",
                        padding: "16px",
                        marginBottom: "20px",
                        color: "#ffffff",
                    }}>
                    <div
                        style={{
                            width: "17px",
                            marginRight: "10px"
                        }}>
                        <img
                            style={{
                                width: "17px",
                            }}
                            src="/img/form-submitted-tick.png" />
                    </div>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            flex: 1,
                            marginTop: "-2px"
                        }}>
                        <div
                            style={{
                                fontSize: "16px",
                            }}>
                            {selectedOption.activeText !== undefined ? selectedOption.activeText : `You choose ${selectedOption.title}.`}{" "}
                            <a href="" onClick={resubmitInfoClicked}>Resubmit answer?</a>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

type AnswerProps = {
    title: string,
    onClick?: () => void
}

export function Answer(props: PropsWithChildren<AnswerProps>) {
    const [isMouseHover, setMouseHover] = useState(false)

    return (
        <span
            onClick={props.onClick}
            onMouseEnter={() => {
                setMouseHover(true)
            }}
            onMouseLeave={() => {
                setMouseHover(false)
            }}
            style={{
                marginTop: "10px",
                marginRight: "30px",
                cursor: "pointer",
                paddingLeft: "20px",
                paddingRight: "20px",
                paddingTop: "5px",
                paddingBottom: "5px",
                background: "#363636",
                borderRadius: "6px",
                borderColor: isMouseHover ? "#ff9933" : "#4d4d4d",
                borderStyle: "solid",
                borderWidth: "1px",
                fontWeight: 600,
            }}>
            {props.title}
        </span>
    );
}