import {forwardRef} from 'react';

const TextInput = (props, ref) => {
    return <input className="w-72 mb-3 p-1 rounded shadow" ref={ref} {...props} />
};

export default forwardRef(TextInput);
