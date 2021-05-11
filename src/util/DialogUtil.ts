export class DialogUtil {
  static yesno(message: string, callback: () => void): void {
    // yesno dialog
    const question: string = Browser.msgBox(
      message,
      Browser.Buttons.YES_NO_CANCEL
    );

    if (question == "yes") {
      callback();
      Browser.msgBox("success!!");
    }
  }
}
