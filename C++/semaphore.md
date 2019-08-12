### Semaphore中文译作信号量，一种常用于多进程的资源锁
  * 其机制可一般理解为：
    1. 初始化时有一个计数器**initialCount**
    2. boost库中有两个相关的类**boost::interprocess::named_semaphore**, **boost::interprocess::interprocess_semaphore**
    3. 使用**::wait**时，count**减1**，**::post**时，count**加1**
    4. 当使用::wait时count**不大于0**则会**阻塞代码运行**，直到有::post调用使得**count大于0**
  * 可用于限制同时访问资源的任务数在initialCount内
