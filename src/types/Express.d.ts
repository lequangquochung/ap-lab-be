declare namespace Express {
  /**
   * Middleware verify the access token & assign more information to the Request params.
   */
  interface Request {
    /**
     * Id of the user
     */
    userId?: number;
    /**
     * List permission of the admin
     */
    permissions?: string[];
    /**
     * Status of the admin/member
     */
    status?: number;
  }
}
