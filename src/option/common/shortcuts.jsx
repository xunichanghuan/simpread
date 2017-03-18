console.log( "===== simpread option common: Shortcuts =====" )

import TextField from 'textfield';

let [ prevShortcuts, keyword ] = [ null, null ];

export default class Shortcuts extends React.Component {

    state = {
        error : "",
        value : this.props.shortcuts,
    };

    changeShortcuts( event ) {
        if ( event.type === "keydown" ) {
            const key = fixKey( event );
            keyword   =  key == "control" ? "ctrl" : key;
            if ( verifyShortkey( keyword )) {
                prevShortcuts = updateShortcuts();
                this.setState({ error : "" });
                this.props.changeShortcuts( prevShortcuts );
            } else if ( keyword.length == 0 || !/^[0-9a-z]{1}$/ig.test( keyword )) {
                this.setState({ error : `当前输入: ${keyword} 不合法，快捷键只能包括：ctrl, shift, alt, 数字, 字母。` });
            }
        } else {
            if ( /^[0-9a-z]{1}$/ig.test( keyword ) ) {
                prevShortcuts = updateShortcuts();
                this.setState({ error : "" });
                this.props.changeShortcuts( prevShortcuts );
            }
        }
        this.setState({ value: prevShortcuts });
    }

    componentDidMount() {
        prevShortcuts = this.state.value;
    }

    render() {
        return (
            <TextField 
                multi={ false } override="true"
                floatingtext="快捷键" 
                value={ this.state.value }
                errortext={ this.state.error }
                onKeyDown={ (event)=> this.changeShortcuts(event) } onChange={ (event)=>this.changeShortcuts(event) }
            />
        )
    }

}

/**
 * Update new shortcuts
 * 
 * @return {string} new shortcuts, e.g. [a s]
 */
function updateShortcuts() {
    const arr     = prevShortcuts.toLowerCase().trim().split(" ");
    let shortcuts = null;
    switch ( arr.length ) {
        case 1:
            shortcuts = `${arr[0]} ${keyword}`;
            break;
        case 2:
            shortcuts = keyword;
            break;
        default:
            console.log( "发生了一些错误。", prevShortcuts, keyword )
            shortcuts = prevShortcuts;
            break;
    }
    return shortcuts;
}

/**
 * Verify shortkey
 * 
 * @param  {string} shortkey, only include: ctrl shift alt number letters
 *                  e.g. [a b] [a 1] [1 b] [shift a] [a ctrl] [1 alt] [1 shift]
 * 
 * @return {boolean}
 */
function verifyShortkey( key ) {
    if ([ "control", "ctrl", "alt", "shift" ].includes( key )) {
        return true;
    } else {
        return false;
    }
}

/**
 * Fix keyboard event key undefinde
 * 
 * @param  {event} keyboard event
 * @return {string} valid key, include 0~9 a~z ctrl shift alt
 */
function fixKey( event ) {
    const keycode = event.keyCode;
    if ( [ 16, 17, 18 ].includes( keycode ) ) {
        return event.key.toLowerCase().trim();
    } else if ( keycode >= 49 || keycode <= 90 ) {
        return event.code.toLowerCase().trim().replace( /(digit|key)/ig, "" );
    }
}
