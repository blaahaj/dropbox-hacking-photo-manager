import { type Observable, ReplaySubject } from "rxjs";

const wrapAsReplay = <T>(obs: Observable<T>) => {
  const replay = new ReplaySubject<T>(1);
  const subscription = obs.subscribe(replay);
  return {
    observable: () => replay.asObservable(),
    close: () => subscription.unsubscribe(),
  };
};

export default wrapAsReplay;
