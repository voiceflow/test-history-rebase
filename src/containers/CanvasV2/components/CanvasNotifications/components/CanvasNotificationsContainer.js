import { styled } from '@/hocs';

const CanvasNotificationsContainer = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  flex-direction: column;
  top: 25px;
  left: 50%;
  margin-left: -150px;
  font-size: 13px;
  transition: 0.15s ease;
  z-index: 5;

  /* for animations */
  .fade-enter {
    transform: translateY(-100%);
    opacity: 0.01;
  }

  .fade-enter.fade-enter-active {
    transform: translateY(0%);
    opacity: 1;
    transition: transform 300ms ease-out, opacity 200ms ease-in;
  }

  .fade-leave {
    transform: translateY(0%);
    opacity: 1;
  }

  .fade-leave.fade-leave-active {
    transform: translateY(-100%);
    opacity: 0.01;
    transition: transform 300ms ease-in, opacity 200ms ease-in;
  }
`;

export default CanvasNotificationsContainer;
