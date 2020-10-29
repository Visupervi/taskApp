function bindAppStore(Class) {
  return (...args) => {

    return new Class(...args);
  }
}

export {bindAppStore}
