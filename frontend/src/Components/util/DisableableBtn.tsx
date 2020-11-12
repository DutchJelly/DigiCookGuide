
import React, {ReactNode} from 'react'

export default function DisableableBtn(props: {className: String, cb: Function, clickable: boolean, children: ReactNode}){
    let classes = `${props.className} ${props.clickable ? '' : 'disabled'}`;
    const style = {
        // opacity: "50%",
    };
    return (
        <button className={classes} style={style} onClick={() => props.clickable && props.cb()}>{props.children}</button>
    )
}