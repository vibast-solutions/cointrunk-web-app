import {getSettings} from "@/storage/settings";
import {getFromLocalStorage, setInLocalStorage} from "@/storage/storage";
import {createDenomConfigQuery} from "@/utils/denom_config";

export const getDenomConfig = createDenomConfigQuery({
    fetch: (url) => fetch(url),
    restEndpoint: () => getSettings().endpoints.restEndpoint,
    cache: {
        get: getFromLocalStorage,
        set: (key, value, ttl) => { setInLocalStorage(key, value, ttl); },
    },
});
