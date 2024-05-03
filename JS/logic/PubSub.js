const listeners = {};
export const PubSub = {
    subscribe: function (data) {
        const {event, listener} = data;

        if (listeners[event] === undefined) {
            listeners[event] = [listener]
        } else{
            listeners[event].push(listener)
        }
    },

    publish: function (data) {
        const {event, details} = data;
        if (listeners[event] === undefined) {
            return
        }

        listeners[event].forEach(listener => {
            listener(details);
        });
    }
}