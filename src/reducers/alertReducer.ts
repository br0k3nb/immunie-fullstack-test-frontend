export type alertState = {
    open: boolean;
    message: string;
    alertType: 'error' | 'info' | 'success' | 'warning';
    duration: number;
}

export type alertActions = { 
    type: "SHOW" | "HIDE",
    payload?: any, //eslint-disable-line
}

export const alertReducer = (state: alertState, action: alertActions) => {
    switch (action.type) { 
        case "SHOW": {
            return {
               ...state,
               open: true,
               alertType: action.payload.variation,
               message: action.payload.message,
               duration: action.payload.duration,
            };
        }
        case "HIDE" : {
            return {
                ...state,
                open: false,
                alertType: 'success',
                message: '',
                duration: null,
            };
        }
        default: {
            throw new Error("Invalid action type")
        }
    }
}

export const alert_default_value = {
    open: false,
    message: '',
    alertType: 'success',
    duration: null 
}
