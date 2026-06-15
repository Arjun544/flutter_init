import '../../../imports/imports.dart';

class RawToast extends StatefulWidget {
  final Widget child;
  final Duration animationDuration;
  final Duration snackbarDuration;
  final Curve? animationCurve;
  final bool autoDismiss;
  final ToastPosition toastPosition;
  final double Function() getscaleFactor;
  final double Function() getPosition;
  final void Function() onRemove;

  const RawToast({
    super.key,
    required this.child,
    required this.animationDuration,
    required this.toastPosition,
    required this.snackbarDuration,
    required this.onRemove,
    this.autoDismiss = true,
    required this.getPosition,
    this.animationCurve,
    required this.getscaleFactor,
  });

  @override
  State<RawToast> createState() => RawToastState();
}

class RawToastState extends State<RawToast> {
  final GlobalKey positionedKey = GlobalKey();

  Widget getChildBasedOnDismiss(Widget child) {
    return Animate(
      onComplete: (controller) {
        if (widget.autoDismiss) {
          widget.onRemove();
        }
      },
      effects: [
        SlideEffect(
          begin: Offset(
            0,
            widget.toastPosition == ToastPosition.bottom ? 2 : -2,
          ),
          end: Offset.zero,
          duration: Duration(
            milliseconds: 2 * widget.animationDuration.inMilliseconds,
          ),
          curve: widget.animationCurve ?? Curves.elasticOut,
        ),
        FadeEffect(
          duration: widget.animationDuration,
          begin: 0,
          end: 1,
        ),
        if (widget.autoDismiss)
          SlideEffect(
            delay: widget.snackbarDuration,
            duration: const Duration(milliseconds: 500),
            curve: widget.animationCurve ?? Curves.easeInOut,
            begin: Offset.zero,
            end: Offset(
              0,
              widget.toastPosition == ToastPosition.bottom ? 2 : -2,
            ),
          ),
      ],
      child: Dismissible(
        key: UniqueKey(),
        direction: DismissDirection.up,
        onDismissed: (direction) {
          widget.onRemove();
        },
        child: widget.child,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedPositioned(
      duration: Duration(
        milliseconds: widget.animationDuration.inMilliseconds,
      ),
      key: positionedKey,
      curve: Curves.easeOutBack,
      top: widget.toastPosition == ToastPosition.top
          ? widget.getPosition() + 55
          : null,
      bottom: widget.toastPosition == ToastPosition.bottom
          ? widget.getPosition() + 60
          : null,
      left: 0,
      right: 0,
      child: Material(
        color: Colors.transparent,
        child: AnimatedScale(
          duration: widget.animationDuration,
          curve: Curves.bounceOut,
          scale: widget.getPosition() == 0 ? 1 : widget.getscaleFactor(),
          child: getChildBasedOnDismiss(widget.child),
        ),
      ),
    );
  }
}

