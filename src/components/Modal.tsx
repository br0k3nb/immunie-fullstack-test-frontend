import { forwardRef, ReactElement, Ref } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { Breakpoint, styled, SxProps, Theme } from "@mui/material/styles";
import { TransitionProps } from "@mui/material/transitions";

export function Modal({
  children,
  open,
  onClose,
  maxWidth,
  ...props
}: {
  children: ReactElement | ReactElement[];
  open: boolean;
  onClose: () => void;
  maxWidth: false | Breakpoint | undefined;
}) {
  return (
    <Dialog
      {...props}
      maxWidth={maxWidth}
      keepMounted
      fullWidth
      scroll="paper"
      open={open}
      TransitionComponent={Transition}
      onClose={onClose}
    >
      {children}
    </Dialog>
  );
}

export function ModalHeader({
  children,
  closeButtonAction,
  ...props
}: {
  children: any; //eslint-disable-line
  closeButtonAction: () => void;
}) {
  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...props}>
      {children}
      {closeButtonAction && (
        <CloseButton onClick={closeButtonAction}>
          <CloseIcon />
        </CloseButton>
      )}
    </DialogTitle>
  );
}

export function ModalContent({
  children,
  ...props
}: {
  children: any; //eslint-disable-line
}) {
  return (
    <DialogContent {...props} dividers>
      {children}
    </DialogContent>
  );
}

export function ModalActions({
  children,
  sx,
  ...props
}: {
  children: ReactElement | ReactElement[];
  sx?: SxProps<Theme>;
}) {
  return (
    <DialogActions sx={sx ? sx : {}} {...props}>
      {children}
    </DialogActions>
  );
}

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: ReactElement<any, any>; //eslint-disable-line
  },
  ref: Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const CloseButton = styled(IconButton)(({ theme }) => ({
  position: "absolute",
  right: 16,
  top: 12,
  color: theme.palette.grey[500],
}));
