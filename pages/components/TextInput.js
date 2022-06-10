import {forwardRef} from 'react';

const TextInput = (props, ref) => {
    return <input className="mb-3 rounded p-1 w-72 shadow" ref={ref} {...props} />
};

export default forwardRef(TextInput);
