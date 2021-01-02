
import React, {ReactNode} from 'react'

export default function DisableableBtn(props: {className: String, cb: Function, clickable: boolean, children: ReactNode}){
    let classes = `${props.className} ${props.clickable ? '' : 'disabled'}`;
    return (
        <button className={classes} onClick={() => props.clickable && props.cb()}>{props.children}</button>
    )
}