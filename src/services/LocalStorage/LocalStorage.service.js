export const LocalStorage = {
  /**
   * Get stored value by key
   * @param {string} key
   * @returns {string}
   */
  get(key) {
    return localStorage.getItem(key);
  },

  /**
   * Store value with key
   * @param {string} key
   * @param {string} value
   */
  set(key, value) {
    localStorage.setItem(key, value);
  },

  /**
   * Delete stored value by key
   * @param {string} key
   */
  remove(key) {
    localStorage.removeItem(key);
  },

  /**
   * Clear localStorage
   */
  clear() {
    localStorage.clear()
  }
};
